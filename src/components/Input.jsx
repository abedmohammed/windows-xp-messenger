import React, { useContext, useState } from "react";

import Img from "../assets/images/img.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ErrorContext } from "../context/ErrorContext";
import Attached from "../assets/images/attached.ico";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { setError, setLoading } = useContext(ErrorContext);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!img && !text) {
      setError("Please enter a message or a photo");
      return;
    }

    try {
      if (img) {
        setLoading({ value: 10, message: "uploading image", type: "input" });
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        setLoading({ value: 30, message: "uploading image", type: "input" });
        await uploadTask;

        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        setLoading({ value: 60, message: "uploading image", type: "input" });
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            img: downloadURL,
          }),
        });
        setLoading(false);
      } else {
        // Update collective chat for both users with new message
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      }

      // Update last message for both users
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
    } catch (err) {
      setLoading(false);
      setError(err.message.replace("Error: ", ""));
      console.error(err);
    }

    setText("");
    setImg(null);
  };

  return (
    <>
      {img && (
        <div className="input__attached">
          <img src={Attached} alt="" />
          <p>{img.name}</p>
        </div>
      )}
      <form onSubmit={handleSend} className="input">
        <input
          className="input__text"
          type="text"
          placeholder="Type something..."
          onChange={(e) => setText(e.target.value)}
          value={text}
        />

        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
          accept="image/*, image/*, image/*"
        />
        <label htmlFor="file" className="input__image">
          <img src={Img} alt="" />
        </label>
        <div className="input__send">
          <button type="submit">Send</button>
        </div>
      </form>
    </>
  );
};

export default Input;

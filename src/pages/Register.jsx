import React, { useContext, useState } from "react";
import Add from "../assets/images/addAvatar.ico";
import Alert from "../assets/images/alert.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import useQuerydb from "../hooks/use-querydb";
import Modal from "../components/Modal";
import { ErrorContext } from "../context/ErrorContext";

const Register = () => {
  const { error, setError } = useContext(ErrorContext);
  const [fileName, setFileName] = useState();
  const [passwordInput, setPasswordInput] = useState("");
  const { performQuery } = useQuerydb();
  const navigate = useNavigate();

  const handlePasswordInput = (e) => {
    setPasswordInput(e.target.value.replaceAll(" ", ""));
  };

  const handleChooseImage = (e) => {
    setFileName(e.target.files[0].name);
  };

  const handleErrorCancel = () => {
    setError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value.trim();
    const email = e.target[1].value.trim();
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      if (!displayName) throw new Error("Username cannot be empty.");

      await performQuery({
        dbCollection: "users",
        dbField: "displayName",
        dbOperator: "==",
        dbMatch: displayName,
        handleQuery: () => {
          throw new Error("This username is already in use.");
        },
      });

      if (!email) throw new Error("Email cannot be empty");

      await performQuery({
        dbCollection: "users",
        dbField: "email",
        dbOperator: "==",
        dbMatch: email,
        handleQuery: () => {
          throw new Error("This email is already in use.");
        },
      });

      if (!password) throw new Error("Password cannot be empty");
      if (password.length < 6)
        throw new Error(
          "Password must be longer than 6 characters, no spaces allowed."
        );
      if (!file) throw new Error("Please use an image");
      if (file.size / 1024 / 1024 > 1) {
        throw new Error("Image size is too big! Maximum: 1MB");
      }

      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await uploadTask;

      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      await updateProfile(res.user, {
        displayName,
        photoURL: downloadURL,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL: downloadURL,
      });

      await setDoc(doc(db, "userChats", res.user.uid), {});
      navigate("/");
    } catch (err) {
      setError(err.message.replace("Error: ", ""));
      console.error(err);
    }
  };

  return (
    <div className="register window-body">
      <h2 className="register__title">Register An Account:</h2>
      {error && (
        <Modal
          title="Error"
          modalMessage={error}
          modalImage={Alert}
          modalActions={[{ label: "Ok", handler: handleErrorCancel }]}
        />
      )}
      <form className="field-row-stacked" onSubmit={handleSubmit}>
        <input id="name" type="text" placeholder="username" />

        <input type="email" placeholder="email" />

        <input
          onChange={handlePasswordInput}
          value={passwordInput}
          id="password"
          type="password"
          placeholder="password"
        />

        <div className="register__profile-pic">
          <input
            style={{ display: "none", width: "max-content" }}
            type="file"
            id="file"
            onChange={handleChooseImage}
            accept="image/*, image/*, image/*"
          />
          <label className="register__upload-image field-row" htmlFor="file">
            <img src={Add} alt="" />
            <span>Add profile picture</span>
          </label>
          {fileName && <div className="register__attached">{fileName}</div>}
        </div>
        <button className="register__submit">Sign Up</button>
      </form>
      <p className="register__existing">
        You already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;

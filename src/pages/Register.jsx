import React, { useState } from "react";
import Add from "../assets/images/addAvatar.ico";
import Warning from "../assets/images/warning.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import TitleBar from "../components/TitleBar";

const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      // Authenticate user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create storage reference with user's display name
      const storageRef = ref(storage, displayName);

      // Upload user's image
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        // "state_changed",
        // (snapshot) => {
        //   // Observe state change events such as progress, pause, and resume
        //   // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        //   const progress =
        //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //   console.log("Upload is " + progress + "% done");
        //   switch (snapshot.state) {
        //     case "paused":
        //       console.log("Upload is paused");
        //       break;
        //     case "running":
        //       console.log("Upload is running");
        //       break;
        //   }
        // },
        (error) => {
          setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
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
          });
        }
      );
    } catch (err) {
      setErr(true);
      console.error(err);
    }
  };

  return (
    <div className="window">
      <TitleBar />
      <div className="window-body">
        <p>Register:</p>
        {err && (
          <div
            className="field-row"
            style={{ marginTop: "15px", marginBottom: "10px" }}
          >
            <img src={Warning} alt="" style={{ width: "25px" }} />
            <span>Something went wrong</span>
          </div>
        )}
        <form className="field-row-stacked" onSubmit={handleSubmit}>
          <input type="text" placeholder="display name" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input
            style={{ display: "none", width: "max-content" }}
            type="file"
            id="file"
          />
          <label className="field-row" htmlFor="file">
            <img src={Add} alt="" />
            <span>Add profile picture</span>
          </label>
          <button>Sign Up</button>
        </form>
        <p>
          You already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

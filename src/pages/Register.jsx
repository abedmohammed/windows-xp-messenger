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
      setErr(true);
      console.error(err);
    }
  };

  return (
    <div className="register window">
      <TitleBar />
      <div className="window-body">
        <h2 className="register__title">Register An Account:</h2>
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
          <input id="name" type="text" placeholder="username" />

          <input type="email" placeholder="email" />

          <input id="password" type="password" placeholder="password" />

          <div className="register__profile-pic">
            <input
              style={{ display: "none", width: "max-content" }}
              type="file"
              id="file"
            />
            <label className="register__upload-image field-row" htmlFor="file">
              <img src={Add} alt="" />
              <span>Add profile picture</span>
            </label>
          </div>
          <button className="register__submit">Sign Up</button>
        </form>
        <p className="register__existing">
          You already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

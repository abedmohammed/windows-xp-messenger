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
import Draggable from "react-draggable";
import TitleBar from "../components/TitleBar";

const Register = () => {
  const { error, setError, loading, setLoading } = useContext(ErrorContext);
  const [fileName, setFileName] = useState();
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordConfirmInput, setPasswordConfirmInput] = useState("");
  const { performQuery } = useQuerydb();
  const navigate = useNavigate();

  const handlePasswordInput = (e) => {
    setPasswordInput(e.target.value.replaceAll(" ", ""));
  };

  const handlePasswordConfirmInput = (e) => {
    setPasswordConfirmInput(e.target.value.replaceAll(" ", ""));
  };

  const handleChooseImage = (e) => {
    setFileName(e.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value.trim();
    const email = e.target[1].value.trim();
    const password = e.target[2].value;
    const passwordConfirm = e.target[3].value;
    const file = e.target[4].files[0];

    try {
      setLoading({ value: 10, message: "validating user details" });
      if (!displayName) throw new Error("Username cannot be empty.");
      if (displayName.length > 16)
        throw new Error("Username cannot be longer than 16 characters.");

      await performQuery({
        dbCollection: "userNames",
        dbField: "userName",
        dbOperator: "==",
        dbMatch: displayName.toLowerCase(),
        handleQuery: () => {
          throw new Error("This username is already in use.");
        },
      });

      if (!email) throw new Error("Email cannot be empty.");

      if (!password) throw new Error("Password cannot be empty.");
      if (password.length < 6)
        throw new Error(
          "Password must be longer than 6 characters, no spaces allowed."
        );
      if (password !== passwordConfirm)
        throw new Error("Passwords do not match.");
      if (!file) throw new Error("Please use an image.");
      if (file.size / 1024 / 1024 > 1) {
        throw new Error("Image size is too big! Maximum: 1MB.");
      }

      setLoading({ value: 20, message: "authenticating account" });

      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, `userProfiles/${displayName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setLoading({ value: 40, message: "uploading image" });

      await uploadTask;

      setLoading({ value: 60, message: "adding to list of users" });

      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      await updateProfile(res.user, {
        displayName,
        photoURL: downloadURL,
      });

      setLoading({ value: 80, message: "creating account details" });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        displayNameLower: displayName.toLowerCase(),
        photoURL: downloadURL,
      });

      await setDoc(doc(db, "userNames", res.user.uid), {
        userName: displayName.toLowerCase(),
      });

      setLoading({ value: 100, message: "finalizing account creation" });

      await setDoc(doc(db, "userChats", res.user.uid), {});

      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);

      if (err.message === "Firebase: Error (auth/email-already-in-use).") {
        setError("This email is already in use.");
      } else {
        setError(err.message.replace("Error: ", ""));
      }

      console.error(err);
    }
  };

  return (
    <>
      {error && <Modal title="Error" modalMessage={error} modalImage={Alert} />}
      {loading && <Modal modalControls={false} title="Registering" />}
      <Draggable handle=".title-bar" positionOffset={{ x: "-50%", y: "-50%" }}>
        <div className="window">
          <TitleBar />
          <div className="register window-body">
            <h2 className="register__title">Register An Account:</h2>

            <form className="register__form" onSubmit={handleSubmit}>
              <div className="register__field register__field--username">
                <label htmlFor="name">Username</label>
                <input
                  autocomplete="off"
                  id="name"
                  type="text"
                  placeholder="username"
                />
              </div>

              <div className="register__field register__field--email">
                <label htmlFor="email">Email</label>
                <input type="email" placeholder="email" autocomplete="email" />
              </div>

              <div className="register__field register__field--password">
                <label htmlFor="password">Password</label>
                <input
                  onChange={handlePasswordInput}
                  value={passwordInput}
                  id="password"
                  type="password"
                  placeholder="password"
                />
              </div>

              <div className="register__field register__field--password-confirm">
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input
                  onChange={handlePasswordConfirmInput}
                  value={passwordConfirmInput}
                  id="passwordConfirm"
                  type="password"
                  placeholder="confirm password"
                />
              </div>

              <div>
                <label
                  htmlFor="file"
                  className="register__field register__field--image"
                >
                  <span>Add profile picture</span>
                  <div className="register__image">
                    <img src={Add} alt="" />
                    <div className="register__attached">
                      {fileName ? fileName : "None Selected"}
                    </div>
                  </div>
                </label>
                <input
                  style={{ display: "none", width: "max-content" }}
                  type="file"
                  id="file"
                  onChange={handleChooseImage}
                  accept="image/*, image/*, image/*"
                />
              </div>
              <button className="register__submit">Sign Up</button>
            </form>
            <p className="register__existing">
              You already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </Draggable>
    </>
  );
};

export default Register;

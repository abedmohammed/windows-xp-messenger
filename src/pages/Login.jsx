import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Alert from "../assets/images/alert.png";
import { ErrorContext } from "../context/ErrorContext";
import Modal from "../components/Modal";
import TitleBar from "../components/TitleBar";
import Draggable from "react-draggable";

const Login = () => {
  const { error, setError } = useContext(ErrorContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials, please try again.");
      console.error(err);
    }
  };

  return (
    <>
      {error && <Modal title="Error" modalMessage={error} modalImage={Alert} />}
      <Draggable handle=".title-bar" positionOffset={{ x: "-50%", y: "-50%" }}>
        <div className="window">
          <TitleBar />
          <div className="login window-body">
            <h2 className="login__title">Login:</h2>

            <form className="field-row" onSubmit={handleSubmit}>
              <input type="email" placeholder="email" />
              <input type="password" placeholder="password" />

              <button>Login</button>
            </form>
            <p className="login__register">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </Draggable>
    </>
  );
};

export default Login;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import TitleBar from "../components/TitleBar";
import Warning from "../assets/images/warning.png";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErr(true);
    }
  };

  return (
    <div className="login window-body">
      <h2 className="login__title">Login:</h2>
      {err && (
        <div
          className="field-row"
          style={{ marginTop: "10px", marginBottom: "5px" }}
        >
          <img src={Warning} alt="" style={{ width: "25px" }} />
          <span>Something went wrong</span>
        </div>
      )}
      <form className="field-row" onSubmit={handleSubmit}>
        <input type="email" placeholder="email" />
        <input type="password" placeholder="password" />

        <button>Login</button>
      </form>
      <p className="login__register">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;

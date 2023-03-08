import React, { useContext } from "react";

import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import Warning from "../assets/images/warning.png";
import { ErrorContext } from "../context/ErrorContext";

const Home = () => {
  const { error } = useContext(ErrorContext);

  return (
    <>
      {error && (
        <Modal title="Error" modalMessage={error} modalImage={Warning} />
      )}
      <div className="container window-body">
        <Sidebar />
        <Chat />
      </div>
    </>
  );
};

export default Home;

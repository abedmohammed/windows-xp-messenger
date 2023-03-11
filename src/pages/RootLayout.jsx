import React from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  // let location = useLocation();
  // const { error } = useContext(ErrorContext);
  // const draggerRef = useRef(null);

  // useEffect(() => {
  //   draggerRef.current?.setState({ x: 0, y: 0 });
  // }, [location]);

  return (
    // <Draggable handle=".title-bar" ref={draggerRef} disabled={error && true}>
    //   <div className="window">
    //     <TitleBar />
    //     <Outlet />
    //   </div>
    // </Draggable>

    <>
      <Outlet />
    </>
  );
};

export default RootLayout;

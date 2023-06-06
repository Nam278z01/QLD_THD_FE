import React, { Fragment, useState } from "react";
import SideBar from "./SideBar";
import NavHader from "./NavHader";
import Header from "./Header";
import { useSelector } from "react-redux";
import logo3 from "../../../../images/favicon.png";

const JobieNav = ({ title, onClick: ClickToAddEvent, depaLogo }) => {
  const [toggle, setToggle] = useState("");
  const onClick = (name) => setToggle(toggle === name ? "" : name);

  const { role } = useSelector((a) => a.UserSlice);
  return (
    <Fragment>
      {role !== "Guest" ? (
        <NavHader />
      ) : (
        <div className="nav-header border-bottom">
          <div className="brand-logo">
            <img src={logo3} className="img-fluid" />
          </div>
        </div>
      )}

      <Header
        onNote={() => onClick("chatbox")}
        onNotification={() => onClick("notification")}
        onProfile={() => onClick("profile")}
        toggle={toggle}
        title={title}
        onBox={() => onClick("box")}
        onClick={() => ClickToAddEvent()}
        depaLogo={depaLogo}
      />
      {role !== "Guest" && <SideBar />}
    </Fragment>
  );
};

export default JobieNav;

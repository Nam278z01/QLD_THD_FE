import React, { useContext } from "react";
/// React router dom
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../../../../context/ThemeContext";
import logo2 from "../../../../images/logo-light.png";
import logo from "../../../../images/logo-dark.png";
import logo3 from "../../../../images/favicon.png";
import { useSelector } from "react-redux";

const NavHader = () => {
  const { navigationHader, background, menuToggle, openMenuToggle } =
    useContext(ThemeContext);

  const path = useLocation().pathname;
  const { role } = useSelector((a) => a.UserSlice);

  return (
    <div className="nav-header border-1 border-bottom">
      {menuToggle ? (
        <Link
          className={`brand-logo ${
            path === `/point/request` || role === "Admin" ? "pe-none" : ""
          }`}
          to={`/point/request`}
        >
          <img src={logo3} className="img-fluid" />
        </Link>
      ) : (
        <Link
          to={`/point/request`}
          className={`brand-logo ${
            path === `/point/request` || role === "Admin" ? "pe-none" : ""
          }`}
        >
          {background.value === "dark" || navigationHader !== "color_1" ? (
            <img src={logo2} alt="" className="img-fluid" />
          ) : (
            <img src={logo} alt="" className="img-fluid" />
          )}
        </Link>
      )}

      {/* <div
        className="nav-control"
        onClick={() => {
          openMenuToggle();
        }}
      >
        <div className={`hamburger ${menuToggle ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div> */}
    </div>
  );
};

export default NavHader;

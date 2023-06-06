import React, { useContext } from "react";
/// React router dom
import { ThemeContext } from "../../../../context/ThemeContext";

const NavHader = () => {
  const { navigationHader, background, menuToggle, openMenuToggle } =
    useContext(ThemeContext);

  return (
    <div className="nav-header border-1 border-bottom">
      <div className="nav-control">
        <div
          className={`hamburger ${menuToggle ? "is-active" : ""}`}
          onClick={() => {
            openMenuToggle();
          }}
        >
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
};

export default NavHader;

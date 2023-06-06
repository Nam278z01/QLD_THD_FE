/// Menu
import Metismenu from "metismenujs";
import React, { Component, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import defaultimg from "../../../../images/Default.png";

/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";
/// Link
import { Link, useLocation } from "react-router-dom";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../../context/ThemeContext";
import { imgServer } from "../../../../dataConfig";
import { AuthenButton } from "../../../sharedPage/components/PluginsMenu/AuthenButton/AuthenButton";

class MM extends Component {
  componentDidMount() {
    this.$el = this.el;
    this.mm = new Metismenu(this.$el);
  }
  componentWillUnmount() {}
  render() {
    return (
      <div className="mm-wrapper">
        <ul className="metismenu" ref={(el) => (this.el = el)}>
          {this.props.children}
        </ul>
      </div>
    );
  }
}

const SideBar = () => {
  const { iconHover, sidebarposition, headerposition, sidebarLayout } =
    useContext(ThemeContext);

  const userInfo = useSelector((state) => state.UserSlice);
  const location = useLocation();
  const path = location.pathname;

  //For scroll
  const [hideOnScroll, setHideOnScroll] = useState(true);

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll]
  );

  let admin = ["/dashboard"];

  return (
    <div
      className={`dlabnav ${iconHover} ${
        sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
          ? hideOnScroll > 120
            ? "fixed"
            : ""
          : ""
      }`}
    >
      <PerfectScrollbar className="dlabnav-scroll">
        <div className="d-flex flex-column justify-content-between h-100">
          <MM className="metismenu" id="menu">
            <li
              className={`${
                admin.includes(path) ? "mm-active" : ""
              } user-select-none`}
            >
              <Link className="has-arrow ai-icon" to="#">
                <i className="fas fa-screwdriver-wrench"></i>
                <span className="nav-text">Admin</span>
              </Link>
              <ul>
                <li>
                  <Link
                    className={`${
                      path === "/dashboard" ? "mm-active pe-none" : ""
                    }`}
                    to="/dashboard"
                  >
                    Dash Board
                  </Link>
                </li>
              </ul>
            </li>
          </MM>
          {/* <div>
            <div className="dropdown header-profile2">
              <div className="header-info2 text-center my-0">
                <img
                  src={
                    userInfo.imgurl
                      ? `${imgServer}${userInfo.imgurl}`
                      : defaultimg
                  }
                  alt="user-avatar"
                />

                <div className="sidebar-info">
                  <div>
                    <h5 className="font-w500 mb-0">{userInfo.name}</h5>
                    <span className="fs-12">{userInfo.email}</span>
                  </div>
                </div>
                <div>
                  <AuthenButton />
                </div>
              </div>
            </div>
            <div className="copyright">
              <p className="text-center">
                <strong>akaRank</strong> 2022 - 2023
              </p>
            </div>
          </div> */}
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default SideBar;

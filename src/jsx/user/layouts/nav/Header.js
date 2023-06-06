import { useMsal } from "@azure/msal-react";
import { Link, useLocation } from "react-router-dom";
/// Image
import defaultimg from "../../../../images/Default.png";

import { Button, Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import Notification from "../../pages/Notification/Notification";
import { imgServer, testerArr } from "../../../../dataConfig";
import ChangeRoleButton from "./ChangeRoleButton";
import ChangeDepartmentButton from "./ChangeDepartmentButton";
import ChangeDepartmentButtonForGuest from "../nav/ChangeDepartmentButtonForGuest";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getSuperUserList } from "../../../../services/SuperUserAPI";
import Loading from "../../../sharedPage/pages/Loading";
const Header = () => {
  const { instance } = useMsal();
  const path = useLocation();

  const userImgUrl = useSelector((state) => state.UserSlice.imgurl);
  const { role, account } = useSelector((state) => state.UserSlice);
  const { Logo } = useSelector((state) => state.DepartmentSettingSlice);
  const [superUserList] = useRefreshToken(getSuperUserList);
  return superUserList === null ? (
    <Loading />
  ) : (
    <div className="header border-bottom">
      <div className={`header-content p-0 ${role === "Guest" && "p-0"}`}>
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
              {role !== "Admin" && (
                <img src={imgServer + Logo} alt="" height={50} />
              )}
            </div>

            {superUserList &&
              superUserList.some(
                (x) => x.Account.toLowerCase() === account.toLowerCase()
              ) && (
                <div className="nav-item  d-none d-md-flex gap-2 col-6">
                  <ChangeRoleButton />
                </div>
              )}

            <ChangeDepartmentButton />

            {/* <div className="ms-auto"><ChangeDepartmentButtonForGuest /></div> */}

            <ul className="navbar-nav header-right ">
              {role !== "Head" && role !== "Guest" && (
                <div className="nav-item d-none d-md-flex gap-2">
                  <Link
                    to={`/point/new-request`}
                    className={`${
                      path.pathname === "/point/new-request" ? "pe-none" : ""
                    }`}
                  >
                    <Button>New Request</Button>
                  </Link>
                </div>
              )}

              <Notification />

              <Dropdown as="li" className="nav-item dropdown header-profile">
                <Dropdown.Toggle as="a" className="nav-link i-false c-pointer">
                  <img
                    src={userImgUrl ? `${imgServer}${userImgUrl}` : defaultimg}
                    width={20}
                    alt="avatar"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu
                  align="right"
                  className="mt-3 dropdown-menu dropdown-menu-end"
                >
                  {/* {role !== "Guest" && (
                    <Link
                      to={`/user-profile/${account}`}
                      className={`dropdown-item ai-icon ${
                        path.pathname === `/user-profile/${account}`
                          ? "pe-none"
                          : ""
                      }`}
                    >
                      <i className="fa-regular fa-user text-primary me-1"></i>
                      <span className="ms-2">Profile</span>
                    </Link>
                  )} */}

                  {role !== "Guest" && (
                    <Link
                      to={`/wallet`}
                      className={`dropdown-item ai-icon ${
                        path.pathname === `/wallet` ? "pe-none" : ""
                      }`}
                    >
                      <i className="fas fa-wallet text-success"></i>
                      <span className="ms-2">My Wallet</span>
                    </Link>
                  )}

                  <Link
                    className="dropdown-item ai-icon"
                    to="#"
                    onClick={() =>
                      instance.logoutRedirect({ postLogoutRedirectUri: "/" })
                    }
                  >
                    <i className="fas fa-regular fa-right-from-bracket text-danger me-1" />
                    <span className="ms-2">Sign Out</span>
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;

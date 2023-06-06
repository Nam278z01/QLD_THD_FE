/// Menu
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  ProSidebarProvider,
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
} from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import "./SideBar.css";

import useRefreshToken from "../../../../Hook/useRefreshToken";
import useAuth from "../../../../Hook/useAuth";

const SideBar = () => {
  const { role, userID } = useSelector((state) => state.UserSlice);
  const { isHead } = useAuth();


  const { DepartmentID, DefaultHead } = useSelector(
    (a) => a.DepartmentSettingSlice
  );

  const path = useLocation().pathname;
  const [openSub, changeOpenSub] = useState(null);
  const { collapseSidebar } = useProSidebar(ProSidebarProvider);

  let Head = [
    `/Head/request-list`,
    `/Head/project-list`,
    `/Head/PM-list`,
    `/Head/PM-add`,
    `/Head/all-member`,
    `/Head/setting`,
    `/Head/request-mark`,
    `/Head/sync`,
    `/Head/working-time`,
  ];

  let PM = [
    `/PM/project-list`,
    `/PM/request-list`,
    `/PM/member-list`,
    `/PM/request-mark`,
    `/PM/working-time`,
  ];

  let request = [`/point/my-request`, `/point/new-request`, `campaign/request`];

  let campaign = [`/campaign-list`, `/campaign-detail/${0}`, `/group-list`];

  let rule = [`/rule/rule-list`, `/rule/new-rule`, `/badge`];

  let dashboard = [`/dashboard`, `/dashboard`, `/dashboard`];

  return (
    <div
      className="position-fixed vh-100 pt-0 user-select-none"
      style={{ top: "7.5rem", zIndex: 6 }}
    >
      <div
        className="d-flex vh-100"
        style={{ background: "white" }}
        onMouseEnter={() => {
          collapseSidebar(false);
        }}
        onMouseLeave={() => {
          collapseSidebar(true);
        }}
      >
        <Sidebar defaultCollapsed={true}>
          <Menu
            renderMenuItemStyles={({ active }) => ({
              ".menu-icon": {
                color: "#496ECC",
              },
            })}
            closeOnClick={true}
          >
            {/* <MenuItem
              className="fw-600"
              icon={<i className="fas fa-crown"></i>}
              onClick={() => {
                changeOpenSub("Leaderboard");
              }}
              active={path === `/leaderboard`}
              routerLink={
                <Link
                  to={`/leaderboard?year=${new Date().getFullYear()}&month=${
                    new Date().getMonth() + 1
                  }`}
                />
              }
            >
              Leaderboard
            </MenuItem> */}

            {/* <MenuItem
              className="fw-600"
              icon={<i className="fas fa-edit"></i>}
              onClick={() => {
                changeOpenSub("Leaderboard");
              }}
              active={path === `/point/request`}
              routerLink={<Link to={`/point/request`} />}
            >
              Request
            </MenuItem> */}
            { isHead &&(
            <SubMenu
              className="fw-600"
              label="Dashboard"
              icon={<i className="fa-regular fa-house"></i>}
              open={openSub === "Dashboard"}
              onClick={() => {
                openSub !== "Dashboard"
                  ? changeOpenSub("Dashboard")
                  : changeOpenSub(null);
              }}
              active={dashboard.includes(path)}
            >
              <MenuItem
                routerLink={
                  <Link
                    className={`${
                      path === `/dashboard` ? "mm-active pe-none" : ""
                    } user-select-none`}
                    to={`/dashboard`}
                  />
                }
                active={path === `/dashboard`}
              >
                Dashboard
              </MenuItem>
            </SubMenu>
            )}

            <SubMenu
              className="fw-600"
              label="Request"
              icon={<i className="fas fa-edit"></i>}
              open={openSub === "Request"}
              onClick={() => {
                openSub !== "Request"
                  ? changeOpenSub("Request")
                  : changeOpenSub(null);
              }}
              active={request.includes(path)}
            >
              <MenuItem
                routerLink={
                  <Link
                    className={`${
                      path === `/point/request` ? "mm-active pe-none" : ""
                    } user-select-none`}
                    to={`/point/request`}
                  />
                }
                active={path === `/point/request`}
              >
                Request Point
              </MenuItem>

              {/* <MenuItem
                routerLink={
                  <Link
                    className={`${
                      path === `/campaign/request` ? "mm-active pe-none" : ""
                    }`}
                    to={`/campaign/request`}
                  />
                }
                active={path === `/campaign/request`}
              >
                Request Campaign
              </MenuItem> */}
            </SubMenu>

            {/* {(role === "PM" || role === "Member") && (
                <SubMenu
                  className="fw-600"
                  label="Request"
                  icon={<i className="fas fa-edit"></i>}
                  open={openSub === "Request"}
                  onClick={() => {
                    openSub !== "Request"
                      ? changeOpenSub("Request")
                      : changeOpenSub(null);
                  }}
                  active={request.include(path)}
                >
                  <MenuItem
                    routerLink={
                      <Link
                        className={`${
                          path === `/point/my-request`
                            ? "mm-active pe-none"
                            : ""
                        }`}
                        to={`/point/my-request?page=1&row=10`}
                      />
                    }
                    active={path === `/point/my-request`}
                  >
                    My Request
                  </MenuItem>
                  <MenuItem
                    routerLink={
                      <Link
                        className={`${
                          path === `/point/request-history`
                            ? "mm-active pe-none"
                            : ""
                        } user-select-none`}
                        to={`/point/request-history`}
                      />
                    }
                    active={path === `/point/request-history`}
                  >
                    History
                  </MenuItem>
                </SubMenu>
              )} */}

            {role === "Head" && (
              <SubMenu
                className="fw-600 active"
                label="List"
                icon={<i className="fas fa-box"></i>}
                open={openSub === "List"}
                onClick={() => {
                  openSub !== "List"
                    ? changeOpenSub("List")
                    : changeOpenSub(null);
                }}
                active={Head.includes(path)}
              >
                <MenuItem
                  routerLink={
                    <Link
                      className={`${
                        path === `/Head/project-list` ? "mm-active pe-none" : ""
                      }`}
                      to={`/Head/project-list?page=1&row=10`}
                    />
                  }
                  active={path === `/Head/project-list`}
                >
                  Project List
                </MenuItem>
                <MenuItem
                  routerLink={
                    <Link
                      className={`${
                        path === `/Head/all-member` ? "mm-active pe-none" : ""
                      }`}
                      to={`/Head/all-member?page=1&row=10`}
                    />
                  }
                  active={path === `/Head/all-member`}
                >
                  Member List
                </MenuItem>
                <MenuItem
                  routerLink={
                    <Link
                      className={`${
                        path === `/Head/working-time` ? "mm-active pe-none" : ""
                      }`}
                      to={`/Head/working-time?page=1&row=10`}
                    />
                  }
                  active={path === `/Head/working-time`}
                >
                  Working Time
                </MenuItem>
              </SubMenu>
            )}

            {role === "PM" && (
              <SubMenu
                className="fw-600"
                label="List"
                icon={<i className="fas fa-box"></i>}
                open={openSub === "List"}
                onClick={() => {
                  openSub !== "List"
                    ? changeOpenSub("List")
                    : changeOpenSub(null);
                }}
                active={PM.includes(path)}
              >
                <MenuItem
                  routerLink={
                    <Link
                      className={`${
                        path === `/PM/project-list` ? "mm-active pe-none" : ""
                      }`}
                      to={`/PM/project-list?page=1&row=10`}
                    />
                  }
                  active={path === `/PM/project-list`}
                >
                  Project List
                </MenuItem>
                <MenuItem
                  routerLink={
                    <Link
                      className={`${
                        path === `/PM/member-list` ? "mm-active pe-none" : ""
                      }`}
                      to={`/PM/member-list?page=1&row=10`}
                    />
                  }
                  active={path === `/PM/member-list`}
                >
                  Member List
                </MenuItem>
                <MenuItem
                  routerLink={
                    <Link
                      className={`${
                        path === `/PM/working-time` ? "mm-active pe-none" : ""
                      }`}
                      to={`/PM/working-time?page=1&row=10`}
                    />
                  }
                  active={path === `/PM/working-time`}
                >
                  Working Time
                </MenuItem>
              </SubMenu>
            )}

            {/* <SubMenu
              className="fw-600"
              label="Campaign"
              icon={<i className="fas fa-star"></i>}
              open={openSub === "Campaign"}
              onClick={() => {
                openSub !== "Campaign"
                  ? changeOpenSub("Campaign")
                  : changeOpenSub(null);
              }}
              active={campaign.includes(path)}
            >
              <MenuItem
                routerLink={
                  <Link
                    className={`${
                      path === `/group-list` ? "mm-active pe-none" : ""
                    } user-select-none`}
                    to={`/group-list`}
                  />
                }
                active={path === `/group-list`}
              >
                Groups
              </MenuItem>

              <MenuItem
                routerLink={
                  <Link
                    className={`${
                      path === `/campaign-list` ? "mm-active pe-none" : ""
                    }`}
                    to={`/campaign-list?page=1&row=9&type=0`}
                  />
                }
                active={path === `/campaign-list`}
              >
                Campaign List
              </MenuItem>
            </SubMenu> */}

            <SubMenu
              className="fw-600"
              label="Rule & Medal"
              icon={<i className="fas fa-balance-scale"></i>}
              open={openSub === "Rule"}
              onClick={() => {
                openSub !== "Rule"
                  ? changeOpenSub("Rule")
                  : changeOpenSub(null);
              }}
              active={rule.includes(path)}
            >
              <MenuItem
                routerLink={
                  <Link
                    className={`${
                      path === `/rule/rule-list` ? "mm-active pe-none" : ""
                    }`}
                    to={`/rule/rule-list?page=1&row=10`}
                  />
                }
                active={path === `/rule/rule-list`}
              >
                Rule
              </MenuItem>
              <MenuItem
                routerLink={
                  <Link
                    className={`${
                      path === `/badge` ? "mm-active pe-none" : ""
                    } user-select-none`}
                    to={`/badge`}
                  />
                }
                active={path === `/badge`}
              >
                Medal
              </MenuItem>
            </SubMenu>

            {/* <MenuItem
              className="fw-600"
              icon={<i className="fas fa-cart-shopping" />}
              onClick={() => {
                changeOpenSub("shop");
              }}
              active={path === `/shop`}
              routerLink={<Link to={`/shop`} />}
            >
              Shop
            </MenuItem> */}
            {role === "Head" && (
              <MenuItem
                className="fw-600"
                icon={<i className="fas fa-rotate" />}
                onClick={() => {
                  changeOpenSub("sync");
                }}
                active={path === `/sync`}
                routerLink={<Link to={`/sync`} />}
              >
                Sync
              </MenuItem>
            )}

            {DefaultHead.HeadID === userID && role === "Head" && (
              <MenuItem
                className="fw-600"
                label="Setting"
                icon={<i className="fas fa-gear" />}
                onClick={() => {
                  changeOpenSub("Setting");
                }}
                routerLink={
                  <Link
                    className={`${
                      path === `/setting` ? "mm-active pe-none" : ""
                    } user-select-none`}
                    to={`/setting`}
                  />
                }
                active={path === `/setting`}
              >
                Setting
              </MenuItem>
            )}
          </Menu>
        </Sidebar>
      </div>
    </div>
  );
};

export default SideBar;

import React, { useState, useEffect } from "react";
import { Button, Dropdown } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import avatar from "../../../../images/avatar/1.jpg";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useContext } from "react";
// import { SocketContext } from "../../../../context/socketContext";
import Loading from "../../../sharedPage/pages/Loading";
import { getUserNotification } from "../../../../services/NotificationAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import NotiCard from "../../components/Card/NotiCard";
import io from "socket.io-client";
import NotificationModal from "../../components/modal/NotificationModal";

function Notification() {
  // const socket = useContext(SocketContext);
  const [numberNoti, setNumberNoti] = useState(0);
  const [show, setShow] = useState(false);
  const { account } = useSelector((state) => state.UserSlice);
  const { userID } = useSelector((state) => state.UserSlice);
  const [query, setQuery] = useState("abc");
  const navigate = useHistory();

  const [notiList, setRefresh, setNotiList] = useRefreshToken(
    getUserNotification,
    userID
  );
  const notiList1 = [
    {
      Content: "noi gi di",
      CreatedDate: "2022-01-03T10:39:25.000Z",
    },
  ];

  if (notiList !== null && notiList.length > 10) {
    setNotiList(notiList.slice(0, 9));
  }
  // socket.emit("newUser", account);

  // useEffect(() => {
  //   socket.emit("newUser", account);

  //   // socket.on("add", (msg) => {
  //   //   setNumberNoti((numberNoti) => numberNoti + 1);
  //   // });

  //   socket.on("All", (msg) => {
  //     setNumberNoti((numberNoti) => numberNoti + 1);
  //   });

  //   return () => {
  //     socket.off("disconnect");
  //   };
  // }, [socket, account]);

  // useEffect(() => {
  //   socket.on("add", (message) => {
  //     setQuery(message);
  //     setNumberNoti((numberNoti) => numberNoti + 1);
  //     setRefresh(new Date());
  //     setShow(true);
  //   });
  // }, []);

  return notiList === null ? (
    <Loading />
  ) : (
    <>
      {/* <NotificationModal show={show} setShow={setShow} setRefresh={setRefresh} message={query}/> */}
      <Dropdown as="li" className="nav-item dropdown notification_dropdown">
        <Dropdown.Toggle
          className="nav-link i-false c-pointer"
          variant=""
          as="a"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19.375"
            height="24"
            viewBox="0 0 19.375 24"
          >
            <g
              id="_006-notification"
              data-name="006-notification"
              transform="translate(-341.252 -61.547)"
            >
              <path
                id="Path_1954"
                data-name="Path 1954"
                d="M349.741,65.233V62.747a1.2,1.2,0,1,1,2.4,0v2.486a8.4,8.4,0,0,1,7.2,8.314v4.517l.971,1.942a3,3,0,0,1-2.683,4.342h-5.488a1.2,1.2,0,1,1-2.4,0h-5.488a3,3,0,0,1-2.683-4.342l.971-1.942V73.547a8.4,8.4,0,0,1,7.2-8.314Zm1.2,2.314a6,6,0,0,0-6,6v4.8a1.208,1.208,0,0,1-.127.536l-1.1,2.195a.6.6,0,0,0,.538.869h13.375a.6.6,0,0,0,.536-.869l-1.1-2.195a1.206,1.206,0,0,1-.126-.536v-4.8a6,6,0,0,0-6-6Z"
                transform="translate(0 0)"
                fill="#135846"
                fillRule="evenodd"
              />
            </g>
          </svg>

          <span
            className="badge light text-white bg-primary rounded-circle"
            hidden={numberNoti === 0}
          >
            {numberNoti / 2}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu
          align="right"
          className="mt-2 dropdown-menu dropdown-menu-end"
        >
          <PerfectScrollbar className="widget-media dlab-scroll p-2 height380">
            <div className="col">
              {notiList.slice(0, 10).map((x, i) => (
                <ul className="timeline">
                  <NotiCard data={x} newNoti={i < numberNoti / 2} />
                </ul>
              ))}
            </div>
          </PerfectScrollbar>
          <Button
            className="bg-white text-primary border-0"
            onClick={() => {
              navigate.push(`/notification-list`);
            }}
          >
            See all notifications <i className="ti-arrow-right" />
          </Button>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default Notification;

import { useContext } from "react";
import { Dropdown, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { changeUserRole } from "../../../../services/UsermasterAPI";

import { updateDepartment } from "../../../../services/DepartmentAPI";
import { updateDefaultHead } from "../../../../services/DefaultHeadAPI";

const DropdownBlog = ({ userID, account, setRefresh }) => {
  const { getToken } = useContext(GetTokenContext);

  const { DepartmentID, DefaultHead } = useSelector(
    (a) => a.DepartmentSettingSlice
  );

  const changeRole = (role) => {
    function success() {
      setRefresh(new Date());
    }
    getToken(changeUserRole, "Update success", success, false, account, role);
  };

  const setDefaultHead = () => {
    function success() {
      setRefresh(new Date());
      setTimeout(() => {
        window.location.reload(false);
      }, 2000);
    }
    getToken(
      updateDefaultHead,
      "New Head had been change",
      success,
      false,
      DefaultHead.ID,
      { HeadID: userID }
    );
  };

  return (
    <>
      <Dropdown className="dropdown btn">
        <Dropdown.Toggle
          as="div"
          className="btn-link i-false"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
              stroke="#262626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
              stroke="#262626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
              stroke="#262626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu">
          <Dropdown.Item
            className="dropdown-item"
            onClick={() => {
              swal({
                title: "Are you sure?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              }).then((willDelete) => {
                if (willDelete) {
                  setDefaultHead(4);
                }
              });
            }}
          >
            Set To Be Default Head
          </Dropdown.Item>

          <Dropdown.Item
            className="dropdown-item"
            onClick={() => {
              swal({
                title: "Are you sure?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              }).then((willDelete) => {
                if (willDelete) {
                  changeRole(4);
                }
              });
            }}
          >
            Demote To Member
          </Dropdown.Item>
          <Dropdown.Item
            className="dropdown-item"
            onClick={() => {
              swal({
                title: "Are you sure?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              }).then((willDelete) => {
                if (willDelete) {
                  changeRole(3);
                }
              });
            }}
          >
            Demote To PM
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default function BUlInfoCard({ info, setRefresh, isDefault }) {
  return (
    <div className="border border-1 rounded-2 p-2 fw-bold mb-2 d-flex justify-content-between align-items-center">
      <div>{info.Account}</div>
      {!isDefault ? (
        <div>
          <DropdownBlog
            userID={info.ID}
            account={info.Account}
            setRefresh={setRefresh}
            isDefault={isDefault}
          />
        </div>
      ) : (
        <div>
          <Button variant="warning" className="pe-none">
            <i className="fas fa-star fa-fw " style={{ fontSize: "1rem" }} />
          </Button>
        </div>
      )}
    </div>
  );
}

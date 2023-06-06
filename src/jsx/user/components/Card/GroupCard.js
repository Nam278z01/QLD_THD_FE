import { Dropdown } from "react-bootstrap";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useContext } from "react";
import { updateGroupCampaign } from "../../../../services/GroupCampaignAPI";
import { useSelector } from "react-redux";
import React from "react";
import { useHistory } from "react-router-dom";

const GroupCard = ({ data, setRefresh }) => {
  const { getToken, getTokenFormData } = useContext(GetTokenContext);
  const navigate = useHistory();

  const { role } = useSelector((state) => state.UserSlice);
  const changeStatusgroup = (number) => {
    const success = () => {
      setRefresh(new Date());
    };

    getToken(updateGroupCampaign, "Update success", success, false, data.ID, {
      GroupData: { Status: number },
    });
  };
  return (
    <div className="pt-3 pb-3 rounded-2">
      <div className="  align-items-center   border bg-light rounded">
        <div className="d-flex flex-row mt-2">
          <h4 className=" col-9 text-primary text-weight text-start ">
            <span className="m-2 underline">{data.Name}</span>
          </h4>
          <span
            className={
              data.Status === 1
                ? "badge bg-success  pt-2 col-2 text-center"
                : "badge bg-danger  pt-2 col-2  text-center"
            }
          >
            {data.Status === 1 ? "Active" : "Inactive"}
          </span>
          <div className=" col-1 text-center">
            {role === "Head" && (
              <Dropdown className="dropdown btn p-0">
                <Dropdown.Toggle
                  as="div"
                  className="i-false"
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
                      navigate.push(`/detail-groupcampaign/${data.ID}`);
                    }}
                  >
                    Edit
                  </Dropdown.Item>
                  {data.Status === 1 ? (
                    <Dropdown.Item
                      className="dropdown-item"
                      onClick={() =>
                        swal({
                          title: "Are you sure?",
                          icon: "warning",
                          buttons: true,
                          dangerMode: true,
                        }).then((willDelete) => {
                          if (willDelete) {
                            changeStatusgroup(2);
                            setRefresh(new Date());
                          }
                        })
                      }
                    >
                      Deactivate
                    </Dropdown.Item>
                  ) : (
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
                            changeStatusgroup(1);
                            setRefresh(new Date());
                          }
                        });
                      }}
                    >
                      Activate
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="m-2 text-blue text-start" style={{ minHeight: 80 }}>
          Description:
          <text className="text-black text-ellipsis">
            {" "}
            {data.ShortDescription}
          </text>
        </div>
        <div className="m-2 text-blue ">
          <text className="text-black text-ellipsis"></text>
        </div>

        <h5 className="m-2 text-blue">
          Total Member:
          <text className=" m-2 text-ellipsis"> {data.UserMasters.length}</text>
        </h5>
      </div>
    </div>
  );
};

export default GroupCard;

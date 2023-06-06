import { useState } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useContext } from "react";
import Loading from "../../../sharedPage/pages/Loading";
import { useHistory } from "react-router-dom";
import GroupCampaignDetailModal from "../../components/modal/GroupCampaignDetailModal";
import { useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { updateGroupCampaign } from "../../../../services/GroupCampaignAPI";
import GroupTotalMembers from "../Detail/GroupTotalMembers";
const GroupListCard = ({ ListGroup, setRefresh }) => {
  const navigate = useHistory();
  const [show, setShow] = useState(false);
  const { getToken, getTokenFormData } = useContext(GetTokenContext);
  const [groupcampaignID, setgroupcampaignID] = useState(null);
  const { role } = useSelector((state) => state.UserSlice);
  const goToDetail = (id) => {
    setgroupcampaignID(id);
    setShow(true);
  };
  const changeStatusgroup = (number, ID) => {
    const success = () => {
      setRefresh(new Date());
    };

    getToken(updateGroupCampaign, "Update success", success, false, ID, {
      GroupData: { Status: number },
    });
  };
  return ListGroup === null ? (
    <Loading />
  ) : (
    <>
      {groupcampaignID && (
        <GroupCampaignDetailModal
          show={show}
          setShow={setShow}
          groupcampaignID={groupcampaignID}
        />
      )}

      <div className="d-flex flex-column">
        {/* <div className="d-flex flex-row ">
              <h1 className="col-12 text-blue m-0 text-center">Group List</h1>
            </div>
            
              <div className="col-10 text-start">
                <CardTitleWithSearch
                  searchHandle={searchHandleUtil}
                  currentSearch={searchQuery}
                />
              </div>
            </div> */}
        <div
          className=" d-flex flex-column border px-2  "
          style={{ minHeight: 690 }}
        >
          <div className=" row py-2 ms-1">
            {ListGroup.GroupCampaignData.length > 0 ? (
              ListGroup.GroupCampaignData.map((data, index) => (
                <div
                  className="pt-3 pb-3 rounded-2"
                  style={{ width: "33%" }}
                  key={index}
                >
                  <div className="  align-items-center   border bg-light rounded">
                    <div className="d-flex flex-row mt-2">
                      <h4 className=" col-9 text-primary text-weight text-start ">
                        <span
                          title={data.Name.length > 35 ? data.Name : ""}
                          className="m-2 underline"
                          style={{ fontSize: "1.15vw" }}
                        >
                          {" "}
                          {data.Name.length <= 35
                            ? data.Name
                            : data.Name.substring(0, 35) + "..."}
                        </span>
                      </h4>

                      <div className="col-2 text-end mt-1">
                        <span
                          className={
                            data.Status === 1
                              ? "badge bg-success    "
                              : "badge bg-danger    "
                          }
                        >
                          {data.Status === 1 ? "Active" : "Inactive"}
                        </span>
                      </div>

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
                                  navigate.push(
                                    `/detail-groupcampaign/${data.ID}`
                                  );
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
                                        changeStatusgroup(2, data.ID);
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
                                        changeStatusgroup(1, data.ID);
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
                    <div className="text-center">
                      <button
                        className="border m-2 rounded-1 text-center"
                        style={{ width: "97%" }}
                        onClick={() => {
                          goToDetail(data.ID);
                        }}
                      >
                        {data.ShortDescription ? (
                          <div
                            className="m-2 text-blue text-start"
                            style={{ minHeight: 80 }}
                          >
                            Description:
                            <text className="text-black text-ellipsis">
                              {" "}
                              <text
                                title={
                                  data.ShortDescription.length > 40
                                    ? data.ShortDescription
                                    : ""
                                }
                                className="col-10 text-black text-truncate"
                                style={{ fontSize: "0.9vw" }}
                              >
                                {" "}
                                {data.ShortDescription.length <= 40
                                  ? data.ShortDescription
                                  : data.ShortDescription.substring(0, 40) +
                                    "..."}
                              </text>
                            </text>
                          </div>
                        ) : (
                          <div
                            className="m-2 text-blue text-start"
                            style={{ minHeight: 80 }}
                          >
                            <text className="text-black text-ellipsis"></text>
                          </div>
                        )}

                        <div className="m-2 text-blue ">
                          <text className="text-black text-ellipsis"></text>
                        </div>
                        {data.UserMasters.length >= 0 ? (
                          <h5 className="m-2 text-blue">
                            Total Member:
                            <text className=" m-2 text-ellipsis">
                              {" "}
                              {data.UserMasters.length}
                            </text>
                          </h5>
                        ) : (
                          <GroupTotalMembers id={data.ID}></GroupTotalMembers>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No data</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupListCard;

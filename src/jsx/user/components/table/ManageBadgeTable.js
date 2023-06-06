import { useContext } from "react";
import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Image,
  Modal,
  OverlayTrigger,
  Row,
  Stack,
  Tooltip,
  Table,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { imgServer } from "../../../../dataConfig";
import useQuery from "../../../../Hook/useQuery";
import useReplaceURL from "../../../../Hook/useReplaceURL";
import { updateBadge } from "../../../../services/BadgeAPI";
import BUAddBadgeModal from "../modal/BUAddBadgeModal";
import BUUpdateBadgeModal from "../modal/BUUpdateBadgeModal";
import CustomPagination from "../Shared/CustomPagination";
import BadgeSchedule from "../Forms/BadgeSchedule";
import BUAwardManualModal from "../modal/BUAwardManual";
import { Tab, Nav } from "react-bootstrap";

const DropdownBlog = ({
  ID,
  setBadgeID,
  setShow,
  AwardType,
  Status,
  setRefresh,
  setShowSchedule,
}) => {
  const { getTokenFormData } = useContext(GetTokenContext);

  const changeStatusBadge = (number) => {
    const formData = new FormData();

    formData.append("Status", number);

    const success = () => {
      setRefresh(new Date());
    };

    getTokenFormData(
      updateBadge,
      "Update success",
      success,
      false,
      formData,
      ID
    );
  };

  const changeAwardType = (awardType) => {
    const formData = new FormData();

    formData.append("AwardType", awardType);

    const success = () => {
      setRefresh(new Date());
    };

    getTokenFormData(
      updateBadge,
      "Update success",
      success,
      false,
      formData,
      ID
    );
  };

  return (
    <>
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
              setShow(true);
              setBadgeID(ID);
            }}
          >
            Edit
          </Dropdown.Item>

          {AwardType !== "auto" ? (
            <Dropdown.Item
              className="dropdown-item"
              onClick={() =>
                swal({
                  title: "Are you sure?",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((result) => {
                  if (result) {
                    changeAwardType("auto");
                    setRefresh(new Date());
                  }
                })
              }
            >
              Update to auto Award
            </Dropdown.Item>
          ) : (
            <></>
          )}
          {Status === 1 ? (
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
                    changeStatusBadge(2);
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
                    changeStatusBadge(1);
                    setRefresh(new Date());
                  }
                });
              }}
            >
              Activate
            </Dropdown.Item>
          )}
          {AwardType === "auto" && (
            <Dropdown.Item
              className="dropdown-item"
              onClick={() => {
                setShowSchedule(true);
                setBadgeID(ID);
              }}
            >
              Schedule
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default function ManageBadeTable({ badgeData, totalPage, setRefresh }) {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [badgeID, setBadgeID] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showAward, setShowAward] = useState(false);

  const { role } = useSelector((a) => a.UserSlice);

  const navigate = useHistory();

  const { URLchange } = useReplaceURL(navigate.location.pathname);
  const query = useQuery();
  const rowQuery = query.get("row") || 20;

  const { getTokenFormData } = useContext(GetTokenContext);

  const changeStatusBadge = (number, badge) => {
    setBadgeID(badge.ID);
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const formData = new FormData();

        formData.append("Status", number);
        if (badge.RuleDefintionID) {
          formData.append("RuleID", badge.RuleDefintionID);
        }

        const success = () => {
          setRefresh(new Date());
        };

        getTokenFormData(
          updateBadge,
          "Update success",
          success,
          false,
          formData,
          badge.ID
        );
      }
    });
  };

  const changeAwardType = (awardType, id) => {

    setBadgeID(id);
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {

        const formData = new FormData();

        formData.append("AwardType", awardType);

        const success = () => {
          setRefresh(new Date());
        };

        getTokenFormData(
          updateBadge,
          "Update success",
          success,
          false,
          formData,
          id
        );
      }
    });
  };

  function pageChangeUtil(page) {
    URLchange(page, rowQuery);
  }

  function rowChangeUtil(row) {
    URLchange(1, row);
  }
  function pageChange(page) {
    URLchange(page, rowQuery);
  }
  function rowChange(row) {
    URLchange(1, row);
  }
  return (
    <>
      <BUAddBadgeModal show={show} setShow={setShow} setRefresh={setRefresh} />
      <BUAwardManualModal
        show={showAward}
        setShow={setShowAward}
        setRefresh={setRefresh}
      />
      {badgeID && (
        <BUUpdateBadgeModal
          show={show2}
          setShow={setShow2}
          badgeID={badgeID}
          setBadgeID={setBadgeID}
          setRefresh={setRefresh}
        />
      )}
      <Tab.Container defaultActiveKey={"BadgeList"}>
        <Nav as="ul" className="nav nav-tabs mx-2 border-0">
          <Nav.Item as="li" className="nav-item" onClick={() => { }}>
            <Nav.Link to="#BadgeList" eventKey="BadgeList">
              List
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as="li" className="nav-item" onClick={() => { }}>
            <Nav.Link to="#BadgeHistoy" eventKey="BadgeHistoy">
              History List
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane id="BadgeList" eventKey="BadgeList">
            <Card>
              <Card.Header>
                <h5 className="m-0">Medals List</h5>
                {role === "Head" && (
                  <div>
                    <Button
                      onClick={(e) => {
                        e.target.blur();
                        setShowAward(true);
                      }}
                      className="me-2"
                    >
                      Award manual <i className="bi bi-gift"></i>
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.target.blur();
                        setShow(true);
                      }}
                    >
                      Add <i className="far fa-plus" />
                    </Button>
                  </div>
                )}
              </Card.Header>
              <Card.Body>
                <Row xs={12} md={12} lg={5}>
                  {badgeData.map((badge, i) => (
                    <Col key={i}>
                      <Card className="p-0" style={{ gridGap: "0" }}>
                        <Card.Header>
                          <strong>{badge.Name}</strong>
                          {badge.Status === 1 ? (
                            <Badge pill>Active</Badge>
                          ) : (
                            <Badge pill bg="danger">
                              Inactive
                            </Badge>
                          )}
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col
                              className="mousePointer"
                              onClick={(e) => {
                                setShow2(true);
                                setBadgeID(badge.ID);
                              }}
                            >
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="time">
                                    Click to edit this medal
                                  </Tooltip>
                                }
                              >
                                <Card.Img
                                  src={`${imgServer}${badge.ImageURL}`}
                                  height={"160px"}
                                />
                              </OverlayTrigger>
                            </Col>
                            <Col xs lg="5" className="p-0 pe-2">
                              <Row className="text-center">
                                <Stack gap={1}>
                                  <Badge
                                    pill
                                    bg={
                                      badge.AwardType == "auto"
                                        ? "success"
                                        : "secondary"
                                    }
                                    className="bg-opacity-75 mb-4"
                                  >
                                    {badge.AwardType == "auto"
                                      ? "Auto"
                                      : "Manual"}
                                  </Badge>
                                  <Button
                                    variant="outline-primary"
                                    className="py-0 text-start"
                                    size="md"
                                    onClick={(e) => {
                                      setShow2(true);
                                      setBadgeID(badge.ID);
                                    }}
                                  >
                                    {" "}
                                    <i className="fas fa-edit"></i> Edit{" "}
                                  </Button>
                                  {badge.Status === 1 ? (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id="active">
                                          Click to deactivate this medal.
                                        </Tooltip>
                                      }
                                    >
                                      <Button
                                        variant="outline-danger"
                                        className="py-0 text-start"
                                        size="md"
                                        onClick={(e) => { changeStatusBadge(2, badge); setRefresh(new Date()); }}
                                      >
                                        {" "}
                                        <i className="fas fa-toggle-off"></i>{" "}
                                        Deactivate{" "}
                                      </Button>
                                    </OverlayTrigger>
                                  ) : (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id="active">
                                          Click to active this medal.
                                        </Tooltip>
                                      }
                                    >
                                      <Button
                                        variant="outline-primary"
                                        className="py-0 text-start"
                                        size="md"
                                        onClick={(e) => { changeStatusBadge(1, badge); setRefresh(new Date()); }}
                                      >
                                        {" "}
                                        <i className="fas fa-toggle-on"></i>{" "}
                                        Active{" "}
                                      </Button>
                                    </OverlayTrigger>
                                  )}
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip id="time">
                                        {badge.AwardType == "auto"
                                          ? "Click to setting schedule."
                                          : "Update to automatically award"}
                                      </Tooltip>
                                    }
                                  >
                                    {badge.AwardType !== "auto" ? (
                                      <Button
                                        className="py-0 text-start"
                                        variant="outline-warning"
                                        size="md"
                                        onClick={(e) => { changeAwardType('auto', badge.ID); setRefresh(new Date()); }}
                                      >
                                        <i className="fas fa-hand-lizard"></i>{" "}
                                        to auto
                                      </Button>
                                    ) : (
                                      <Button
                                        className="py-0 text-start"
                                        variant="outline-success"
                                        size="md"
                                        onClick={() => {
                                          setShowSchedule(true);
                                          setBadgeID(badge.ID);
                                        }}
                                      >
                                        <i className="bi bi-alarm-fill"></i>{" "}
                                        Schedule
                                      </Button>
                                    )}
                                  </OverlayTrigger>
                                </Stack>
                              </Row>
                            </Col>
                            {badgeData.length === 0 && (
                              <div>
                                <h5 className="text-center text-secondary m-0">
                                  No data
                                </h5>
                              </div>)}
                          </Row>
                        </Card.Body>
                        <Card.Footer className="bg-success p-2 text-dark bg-opacity-10 text-truncate">
                          {badge.Description}
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {/* <div className="row g-3">
                  {badgeData.map((badge, i) => (
                    <div key={i} className="col-lg-3 col-md-6 col-12">
                      <Card className="m-0 p-2">
                        <div className="row align-items-center justify-content-between">
                          <div
                            className="col-9"
                            onClick={(e) => {
                              setShow2(true);
                              setBadgeID(badge.ID);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex align-items-center">
                              <div className="border border-3 bg-light rounded-3 p-1">
                                <img
                                  src={`${imgServer}${badge.ImageURL}`}
                                  height={50}
                                  width={50}
                                />
                              </div>
                              <div className="ms-2">
                                <h6 className="m-0 text-primary">
                                  {badge.Name}
                                </h6>
                                <div
                                  height="20px"
                                  width="50px"
                                  style={{
                                    width: "100px",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                  className="m-0 overflow-hidden"
                                >
                                  {" "}
                                  {badge.Description}
                                </div>
                              </div>
                              <div className="ms-2">
                                <span
                                  className={`m-0 badge text-bg-${badge.AwardType == "auto"
                                    ? "success"
                                    : "secondary"
                                    }`}
                                >
                                  {badge.AwardType == "auto"
                                    ? "Auto"
                                    : "Manual"}
                                </span>
                                {badge.AwardType == "auto" && (
                                  <i
                                    style={{ color: "#fd7e14" }}
                                    className="bi bi-alarm-fill"
                                  ></i>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="row g-2">
                              <div className="col-12">
                                {badge.Status === 1 ? (
                                  <Badge style={{ width: "100%" }} bg="success">Pending</Badge>
                                ) : (
                                  <Badge style={{ width: "100%" }} bg="danger">Inactive</Badge>
                                )}
                              </div>
                              <div className="col-12">
                                {badge.Status === 1 ? (
                                  <Badge style={{ width: "100%" }} bg="warning">Auto every month</Badge>
                                ) : (
                                  <Badge style={{ width: "100%" }} bg="danger">Inactive</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="d-flex justify-content-end">
                              {badge.Status === 1 ? (
                                <Badge>Active</Badge>
                              ) : (
                                <Badge bg="danger">Inactive</Badge>
                              )}
                            </div>
                            {role === "Head" && (
                              <div className="text-end">
                                <DropdownBlog
                                  ID={badge.ID}
                                  AwardType={badge.AwardType}
                                  setBadgeID={setBadgeID}
                                  setShowSchedule={setShowSchedule}
                                  showSchedule={showSchedule}
                                  setShow={setShow2}
                                  Status={badge.Status}
                                  setRefresh={setRefresh}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}

                  {badgeData.length === 0 && (
                    <div>
                      <h5 className="text-center text-secondary m-0">
                        No data
                      </h5>
                    </div>
                  )}
                </div> */}
              </Card.Body>

              <Card.Footer className="border-0 bg-transparent">
                <CustomPagination
                  pageChange={pageChangeUtil}
                  rowChange={rowChangeUtil}
                  totalPage={totalPage}
                  noRowChange={false}
                  row={rowQuery}
                />
              </Card.Footer>
            </Card>
          </Tab.Pane>
          <Tab.Pane id="BadgeHistoy" eventKey="BadgeHistoy">
            <div className="border p-5">
              {/* <h5 className=" text-center">History List</h5> */}
              <div style={{ width: "100%" }} className="justify-content-center">
                {/* {walletID && (
                    <WalletDetailModal
                      show={Show}
                      setShow={setShow}
                      walletID={walletID}
                    />
                  )} */}
                <div className="row">
                  <div className="col-12  rounded-lg border border-gray-200 rounded-1 w-100 p-0 ">
                    <div className="w-100 mx-auto mousePointer">
                      <div
                        className=" pe-3 row   text-center m-auto "
                        style={{
                          width: "100%",
                          height: "auto",
                        }}
                      >
                        <div
                          className=" mt-2 ps-0"
                          style={{ width: "10%" }}
                        ></div>
                        <div
                          className=" text-center mt-2 mb-1"
                          style={{ width: "18%" }}
                        >
                          Giver
                        </div>
                        <div
                          className=" fw-normal mt-2 mb-1"
                          style={{ width: "18%" }}
                        >
                          Received
                        </div>
                        <div
                          className="mt-2 text-center mb-1"
                          style={{ width: "18%" }}
                        >
                          Badge Name
                        </div>
                        <div
                          className="mt-2 text-center mb-1"
                          style={{ width: "18%" }}
                        >
                          Image
                        </div>
                        <div
                          className=" mt-2  pe-0 mb-1"
                          style={{
                            width: "18%",
                          }}
                        >
                          Created Date
                        </div>
                      </div>
                      <hr className="m-0" style={{ width: "100%" }}></hr>
                      {/* {datapage.walletData.length > 0 ? (
                          datapage.walletData.map((d, index) => ( */}
                      <div
                        className="bg-light py-4 pe-3 row  m-0 mb-3 border-bottom border-top text-center"
                        style={{ width: "100%", height: "auto" }}
                      // key={index}
                      >
                        <div
                          className=" mt-2 ps-0"
                          style={{ width: "10%" }}
                          onClick={() => {
                            // goToDetail(d.ID);
                          }}
                        >
                          {/* #{index + 1} */}
                          #1
                        </div>
                        <div
                          className=" fw-normal mt-2"
                          style={{ width: "18%" }}
                          onClick={() => {
                            // goToDetail(d.ID);
                          }}
                        >
                          {/* {moment(d.CreatedDate).format("HH:mm")}{" "}
                            {moment(d.CreatedDate).format("DD/MM/YYYY")} */}
                          <div className="d-flex justify-content-center">
                            <div className=" w-50">
                              <span>DucNM72</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className=" fw-normal mt-2"
                          style={{ width: "18%" }}
                          onClick={() => {
                            // goToDetail(d.ID);
                          }}
                        >
                          {/* {moment(d.CreatedDate).format("HH:mm")}{" "}
                            {moment(d.CreatedDate).format("DD/MM/YYYY")} */}
                          <div className="d-flex justify-content-center">
                            <div className=" w-50">
                              <span>DucNM72</span>
                            </div>
                          </div>
                        </div>

                        <div
                          className="mt-2 "
                          style={{ width: "18%" }}
                          onClick={() => {
                            // goToDetail(d.ID);
                          }}
                        >
                          <span className="fw-normal">C++</span>
                        </div>

                        <div
                          className="mt-2 "
                          style={{ width: "18%" }}
                          onClick={() => {
                            // goToDetail(d.ID);
                          }}
                        >
                          {/* <img
                            src={`${imgServer}${badge.ImageURL}`}
                            height={50}
                            width={50}
                          /> */}
                        </div>
                        <div
                          className="   "
                          style={{
                            width: "18%",
                            height: "auto",
                          }}
                          onClick={() => {
                            // goToDetail(d.ID);
                          }}
                        >
                          <p>09/12/2001</p>{" "}
                        </div>
                      </div>
                      {/* ))
                        ) : (
                          <p>No data</p>
                        )} */}
                    </div>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="card-footer  bg-transparent border-0 border">
                      {/* <CustomPagination
                      pageChange={pageChange}
                      totalPage={datapage.totalPage}
                      rowChange={rowChange}
                    /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      <Modal
        show={showSchedule}
        onHide={() => setShowSchedule(false)}
        backdrop="static"
        keyboard={false}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BadgeSchedule
            badgeId={badgeID}
            setShow={setShowSchedule}
            setRefresh={setRefresh}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

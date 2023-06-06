import { Modal, Tab, Nav } from "react-bootstrap";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Loading from "../../../sharedPage/pages/Loading";
import { useState } from 'react';

const CreateUpdateCampaignModal = ({
  show,
  setShowModal,
  
}) => {

  return (
    data !== null && (
      <Modal
        show={show}
        centered
        size="lg"
        onHide={(e) => {
          setShowModal(true);
        }}
      >
        <Modal.Header closeButton> Create New Campaign </Modal.Header>
        <Modal.Body>

        </Modal.Body>

        {/* {data === null ? (
          <Loading />
        ) : (
          <Modal.Body>
            <div className="row m-0 p-1 justify-content-between">
              <div className="col-3">
                <img
                  src={data.Avatar ? data.Avatar : defaultImg}
                  className="img-fluid rounded-circle"
                />
              </div>
              <div className="col-8">
                <div className="row g-2">
                  <div className="col-3">
                    <p className="m-0">Account:</p>
                    <p className="m-0">Nick Name: </p>
                    <p className="m-0">Role: </p>
                    <p className="m-0">Job Title: </p>
                    <p className="m-0">Email: </p>
                    <p className="m-0">EmployeeID: </p>
                  </div>
                  <div className="col-9">
                    <p className="m-0 fw-bold">{data.Account || "-"}</p>
                    <p className="m-0 fw-bold text-secondary">
                      {data.Nickname ? data.Nickname : "-"}
                    </p>
                    <p className="m-0 fw-bold">
                      {UserMaster.Role[data.RoleID - 1] || "-"}
                    </p>
                    <p className="m-0 fw-bold">
                      {UserMaster.JobTitle[data.JobTitle - 1] || "-"}
                    </p>
                    <p className="m-0 fw-bold">{data.Email || "-"}</p>
                    <p className="m-0 fw-bold">{data.EmployeeID || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-tab">
              <div className="custom-tab-1">
                <Tab.Container defaultActiveKey="Update">
                  <Nav as="ul" className="nav nav-tabs">
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link to="#Update" eventKey="Update">
                        Update
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link to="#Badge" eventKey="Badge">
                        Badge
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane id="badge" eventKey="Badge">
                      <TheBadgeCard badges={badges} userID={data.ID} />
                    </Tab.Pane>
                    <Tab.Pane id="update" eventKey="Update">
                      <ThePromoteCard data={data} setRefresh={setRefresh} />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>
          </Modal.Body>
        )} */}
      </Modal>
    )
  );
};

export default CreateUpdateCampaignModal;

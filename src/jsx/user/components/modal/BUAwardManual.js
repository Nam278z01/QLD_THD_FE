import { Button, Col, Container, Row } from "react-bootstrap";
import CustomModalUtil from "../Shared/CustomModalUtil";
import { Table } from "react-bootstrap";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { getExcelBadge, getExcelPM } from "../../../../services/ExportAPI";
import moment from "moment";
import { useState } from "react";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import {
  getAllHistoryBadge,
  getAllWorkingDepartment,
  getAllWorkingNoPageWithMoreData,
} from "../../../../services/UsermasterAPI";
import ImportBadgeExcelModal from "./ImportBadgeExcelModal ";
import DownloadExcel from "../../pages/Sync/DownloadExcel";
export default function BUAwardManualModal({ show, setShow, setRefresh }) {
  const { getTokenDownload } = useContext(GetTokenContext);
  const [showModal, setShowModal] = useState(false);
  const [showModalLoading, setShowModalLoading] = useState(false);

  const [dataHistory, setdataHistory] = useRefreshToken(getAllHistoryBadge);

  return dataHistory === null ? (
    <></>
  ) : (
    <>
      <ImportBadgeExcelModal
        show={showModal}
        setShowModal={setShowModal}
        setShowModalLoading={setShowModalLoading}
        setShow={setShow}
        setdataHistory={setdataHistory}
      />
      <CustomModalUtil
        title="Award Manual"
        show={show}
        setShow={setShow}
        size="xl"
      >
        <Container>
          <Row>
            <Col>
              {/* <Button variant="success" className="float-end ms-2">
                Award
              </Button> */}
              <Button
                variant="success"
                className="float-end ms-2"
                onClick={(e) => {
                  setShowModal(true);
                  setShow(false);
                  e.target.blur();
                }}
              >
                Import <i className="fas fa-file-arrow-down"></i>
              </Button>
              <Button
                variant="success"
                className="float-end ms-2"
                onClick={(e) => {
                  e.target.blur();
                  getTokenDownload(
                    getExcelBadge,
                    `BADGE-TEMPLATE(${moment(new Date()).format("DD-MM-YYYY")})`
                  );
                }}
                title="Download template to import"
              >
                Export <i className="fas fa-file-import"></i>
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className=" mt-2 text-center fs-5 fw-bold">
                Badge Import History
              </div>
              <div
                className="mt-3 p-4 rounded-5 border"
                style={{
                  maxHeight: 550,
                  minHeight: 250,
                  overflow: "auto",
                }}
              >
                <Table className="text-center ">
                  <thead>
                    <tr>
                      <th>Total Line</th>
                      <th>Number Line Success</th>
                      <th>Number Line Fail</th>
                      <th>File Fail</th>
                      <th>File Success</th>
                      <th>Created Date</th>
                    </tr>
                  </thead>
                  <tbody
                    className=""
                    style={{ maxHeight: 270, minHeight: 210 }}
                  >
                    {dataHistory.map((data, i) => (
                      <tr className="text-center" key={i}>
                        <td>{data.TotalLine}</td>
                        <td>{data.NumberLineSuccess}</td>
                        <td>{data.NumberLineFail}</td>
                        <td>
                          <div>
                            <DownloadExcel data={data.FileFailURL} />{" "}
                          </div>
                        </td>
                        <td>
                          <div>
                            <DownloadExcel data={data.FileSuccessURL} />{" "}
                          </div>
                        </td>
                        <td>{data.CreatedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Container>
      </CustomModalUtil>
    </>
  );
}

import RequestTable from "../../components/table/RequestTable";
import { getExcelHead, getExcelPM } from "../../../../services/ExportAPI";
import { getRequest } from "../../../../services/RequestAPI";
import useQuery from "../../../../Hook/useQuery";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import ImportPointexcelModal from "../../components/modal/ImportPointExcelModal";
import { useContext, useState } from "react";
import Loading from "../../../sharedPage/pages/Loading";
import LoadingModal from "../../components/modal/LoadingModal";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import moment from "moment";

const RequestList = () => {
  const query = useQuery();
  const searchQuery = query.get("search");
  const sortQuery = query.get("sort");
  const pageQuery = query.get("page") || 1;
  const rowQuery = query.get("row") || 10;

  const { role, account } = useSelector((state) => state.UserSlice);
  const { PointName } = useSelector((a) => a.DepartmentSettingSlice);

  const [show, setShow] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const [data, setRefresh] = useRefreshToken(
    getRequest,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    role,
    account
  );
  const { getTokenDownload } = useContext(GetTokenContext);

  const extraHead = (
    <div className="d-flex justify-content-end gap-2">
      {role === "PM" ? (
        <Button
          onClick={(e) => {
            e.target.blur();
            getTokenDownload(
              getExcelPM,
              `PM-POINT-TEMPLATE(${moment(new Date()).format("DD-MM-YYYY")})`
            );
          }}
          title="Download template to import"
        >
          Download <i className="fas fa-file-arrow-down" />
        </Button>
      ) : (
        <>
          <Button
            onClick={(e) => {
              e.target.blur();
              getTokenDownload(
                getExcelHead,
                `HEAD-POINT-TEMPLATE(${moment(new Date()).format(
                  "DD-MM-YYYY"
                )})`
              );
            }}
            title="Download template to import"
          >
            Download <i className="fas fa-file-arrow-down" />
          </Button>
        </>
      )}
      <Button
        onClick={(e) => {
          setShow(true);
          e.target.blur();
        }}
      >
        Import <i className="fas fa-file-import" />
      </Button>
    </div>
  );

  return data === null ? (
    <Loading />
  ) : (
    <>
      <ImportPointexcelModal
        show={show}
        setShowModal={setShow}
        setShowLoading={setShowLoading}
        setRefresh={setRefresh}
      />

      <LoadingModal show={showLoading} />
      <RequestTable
        middleExtra={extraHead}
        currentSearch={searchQuery}
        datas={data.requestData}
        status={false}
        totalItems={data.totalItems}
        thead={[
          { Title: "Account", Atribute: "", sort: false },
          {
            Title: `${role === "Head" ? "Confirm By" : "Approver"}`,
            Atribute: "",
            sort: false,
          },
          { Title: "Project", Atribute: "", sort: false },
          {
            Title: PointName,
            Atribute: "PointOfRule",
            sort: true,
            className: "justify-content-center",
          },
          { Title: "Rule", Atribute: "", sort: false },
          {
            Title: "Times",
            Atribute: "Times",
            sort: true,
            className: "justify-content-center",
          },
          {
            Title: "Date",
            Atribute: "CreatedDate",
            sort: true,
            className: "justify-content-center",
          },
          {
            Title: "Status",
            Atribute: "",
            sort: false,
            className: "text-center",
          },
          // { Title: " ", Atribute: "", sort: false },
        ]}
        totalPage={data.totalPage}
        title={`${role} Request List`}
        setRefresh={setRefresh}
      />
    </>
  );
};

export default RequestList;

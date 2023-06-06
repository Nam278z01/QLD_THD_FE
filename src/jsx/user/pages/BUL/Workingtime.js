import useRefreshToken from "../../../../Hook/useRefreshToken";
import {
  getAllWorkingDepartment,
  getAllWorkingNoPageWithMoreData,
} from "../../../../services/UsermasterAPI";
import useQuery from "../../../../Hook/useQuery";
import { useState } from "react";
import { Button } from "react-bootstrap";
import useReplaceURL from "../../../../Hook/useReplaceURL";
import Loading from "../../../sharedPage/pages/Loading";
import ExportExcel from "../../components/Shared/ExportExcel";
import LoadingModal from "../../components/modal/LoadingModal";
import { useSelector } from "react-redux";
import WorkingTable from "../../components/table/WorkingTable";
import ImportWorkexcelModal from "../../components/modal/ImportWorkexcelModal";
import { getYearListWorkingTimeSelect } from "../../../../services/LeaderBoardAPI";

const Workingtime = () => {
  const query = useQuery();
  const searchQuery = query.get("search");
  const sortQuery = query.get("sort");
  const pageQuery = query.get("page") || 1;
  const rowQuery = query.get("row") || 10;
  const monthQuery = query.get("Month");
  const yearQuery = query.get("Year");

  const [showModal, setShowModal] = useState(false);
  const [showModalLoading, setShowModalLoading] = useState(false);
  const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
  const { role } = useSelector((state) => state.UserSlice);
  const { URLchange } = useReplaceURL(`/Head/working-time`);
  function pageChange(page) {
    URLchange(
      page,
      rowQuery,
      sortQuery,
      searchQuery,
      null,
      null,
      monthQuery ? `&Month=${monthQuery}` : "",
      yearQuery ? `&Year=${yearQuery}` : ""
    );
  }

  function rowChange(row) {
    URLchange(
      1,
      row,
      sortQuery,
      searchQuery,
      null,
      null,
      monthQuery ? `&Month=${monthQuery}` : "",
      yearQuery ? `&Year=${yearQuery}` : ""
    );
  }

  function sortHandle(toSort) {
    URLchange(
      1,
      rowQuery,
      toSort,
      searchQuery,
      null,
      null,
      monthQuery ? `&Month=${monthQuery}` : "",
      yearQuery ? `&Year=${yearQuery}` : ""
    );
  }

  function searchHandle(search) {
    URLchange(
      1,
      rowQuery,
      sortQuery,
      search,
      null,
      null,
      monthQuery ? `&Month=${monthQuery}` : "",
      yearQuery ? `&Year=${yearQuery}` : ""
    );
  }

  function filterHandle(filter, type) {
    if (type === "Month") {
      URLchange(
        1,
        rowQuery,
        sortQuery,
        searchQuery,
        null,
        null,
        filter,
        yearQuery ? `&Year=${yearQuery}` : ""
      );
    }
    if (type === "Year") {
      URLchange(
        1,
        rowQuery,
        sortQuery,
        searchQuery,
        null,
        null,
        filter,
        monthQuery ? `&Month=${monthQuery}` : ""
      );
    }
  }
  const [year] = useRefreshToken(getYearListWorkingTimeSelect, DepartmentID);

  const [AllWorking, setAllWorking] = useRefreshToken(
    getAllWorkingNoPageWithMoreData,
    searchQuery
  );

  const [data, setRefresh] = useRefreshToken(
    getAllWorkingDepartment,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    monthQuery,
    yearQuery
  );
  return data === null || AllWorking === null || year === null ? (
    <Loading />
  ) : (
    <>
      <ImportWorkexcelModal
        show={showModal}
        setShowModal={setShowModal}
        setAllMember={setAllWorking}
        setRefresh={setRefresh}
        setShowModalLoading={setShowModalLoading}
        DepartmentID={DepartmentID}
      />
      <LoadingModal show={showModalLoading} />
      <WorkingTable
        currentSearch={searchQuery}
        middleExtra={
          role === "Head" &&
          (AllWorking != null ? (
            <div className="d-flex gap-2 align-items-center justify-content-end mt-1">
              {/* <Button
                onClick={(e) => {
                  e.target.blur();
                  navigate.push("/rule/new-rule");
                }}
              >
                New Working <i className="fa-solid fa-plus" />
              </Button> */}
              <ExportExcel
                datas={AllWorking}
                element={"Export"}
                exportName="Working Time List"
              />

              <Button
                onClick={(e) => {
                  setShowModal(true);
                  e.target.blur();
                }}
              >
                Import <i className="fas fa-file-import" />
              </Button>
            </div>
          ) : (
            false
          ))
        }
        title="Working Time List"
        datas={data.working}
        setRefresh={setRefresh}
        thead={[
          {
            Title: "Name",
            Atribute: "DisplayName",
            sort: false,
            className: "text-center",
          },
          {
            Title: "Account",
            Atribute: "Account",
            sort: false,
            className: "text-center",
          },

          {
            Title: "Month",
            filter: [
              { title: "1", value: 1 },
              { title: "2", value: 2 },
              { title: "3", value: 3 },
              { title: "4", value: 4 },
              { title: "5", value: 5 },
              { title: "6", value: 6 },
              { title: "7", value: 7 },
              { title: "8", value: 8 },
              { title: "9", value: 9 },
              { title: "10", value: 10 },
              { title: "11", value: 11 },
              { title: "12", value: 12 },
            ],
            filterType: "Month",
          },
          {
            Title: "Year",
            filter: year,
            filterType: "Year",
          },
          {
            Title: "WorkDateNumber",
            Atribute: "WorkDateNumber",
            sort: true,
            className: "justify-content-center",
          },
        ]}
        totalPage={data.totalPage}
        totalItems={data.totalItems}
        showRole={true}
        filterHandle={filterHandle}
        pageChange={pageChange}
        rowChange={rowChange}
        sortHandle={sortHandle}
        searchHandle={searchHandle}
      />
    </>
  );
};

export default Workingtime;

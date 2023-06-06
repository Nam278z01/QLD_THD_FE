import useRefreshToken from "../../../../Hook/useRefreshToken";
import {
  getAllMember,
  getAllMemberDepartment,
  getAllUserMasterNoPageWithMoreData,
} from "../../../../services/UsermasterAPI";
import useQuery from "../../../../Hook/useQuery";
import PMListTable from "../../components/table/PMListTable";
import { useState } from "react";
import { Button } from "react-bootstrap";
import ImportMemexcelModal from "../../components/modal/ImportMemExcelModal";
import useReplaceURL from "../../../../Hook/useReplaceURL";
import Loading from "../../../sharedPage/pages/Loading";
import ExportExcel from "../../components/Shared/ExportExcel";
import LoadingModal from "../../components/modal/LoadingModal";
import { useSelector } from "react-redux";

const AllMemberList = () => {
  const query = useQuery();
  const searchQuery = query.get("search");
  const sortQuery = query.get("sort");
  const pageQuery = query.get("page") || 1;
  const rowQuery = query.get("row") || 10;
  const roleQuery = query.get("role");
  const statusQuery = query.get("status");

  const [showModal, setShowModal] = useState(false);
  const [showModalLoading, setShowModalLoading] = useState(false);
  const { Code, IsFsu } = useSelector((a) => a.DepartmentSettingSlice);
  const { URLchange } = useReplaceURL(`/Head/all-member`);
  function pageChange(page) {
    URLchange(
      page,
      rowQuery,
      sortQuery,
      searchQuery,
      null,
      null,
      roleQuery ? `&role=${roleQuery}` : "",
      statusQuery ? `&status=${statusQuery}` : ""
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
      roleQuery ? `&role=${roleQuery}` : "",
      statusQuery ? `&status=${statusQuery}` : ""
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
      roleQuery ? `&role=${roleQuery}` : "",
      statusQuery ? `&status=${statusQuery}` : ""
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
      roleQuery ? `&role=${roleQuery}` : "",
      statusQuery ? `&status=${statusQuery}` : ""
    );
  }

  function filterHandle(filter, type) {
    if (type === "role") {
      URLchange(
        1,
        rowQuery,
        sortQuery,
        searchQuery,
        null,
        null,
        filter,
        statusQuery ? `&status=${statusQuery}` : ""
      );
    }
    if (type === "status") {
      URLchange(
        1,
        rowQuery,
        sortQuery,
        searchQuery,
        null,
        null,
        filter,
        roleQuery ? `&role=${roleQuery}` : ""
      );
    }
  }

  const [AllMember, setAllMember] = useRefreshToken(
    getAllUserMasterNoPageWithMoreData,
    searchQuery
  );

  const [data, setRefresh] = useRefreshToken(
    getAllMemberDepartment,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    roleQuery,
    statusQuery
  );
  return data === null || AllMember === null ? (
    <Loading />
  ) : (
    <>
      <ImportMemexcelModal
        show={showModal}
        setShowModal={setShowModal}
        setAllMember={setAllMember}
        setRefresh={setRefresh}
        setShowModalLoading={setShowModalLoading}
      />
      <LoadingModal show={showModalLoading} />
      <PMListTable
        currentSearch={searchQuery}
        middleExtra={
          AllMember != null ? (
            <div className="d-flex gap-2 align-items-center justify-content-end mt-1">
              <ExportExcel
                datas={AllMember}
                element={"Export"}
                exportName="Member List"
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
          )
        }
        title="All Member List"
        datas={data.allMem}
        setRefresh={setRefresh}
        thead={
          IsFsu === 1
            ? [
                { Title: "Department", Atribute: "DisplayName", sort: false },
                { Title: "Group", Atribute: "DisplayName", sort: false },
                { Title: "Name", Atribute: "DisplayName", sort: false },
                {
                  Title: "Account",
                  Atribute: "Account",
                  sort: true,
                  className: "justify-content-start",
                },
                { Title: "Job Title", Atribute: "", sort: false },

                {
                  Title: "Role",
                  filter: [
                    { title: "Member", value: 4 },
                    { title: "PM", value: 3 },
                    { title: "Head", value: 2 },
                  ],
                  filterType: "role",
                },

                { Title: "Phone Number", Atribute: "PhoneNumber", sort: false },
                { Title: "Birth Day", Atribute: "DOB", sort: false },
                { Title: "Contract Type", Atribute: "", sort: false },

                {
                  Title: "Status",
                  filter: [
                    { title: "Active", value: 1 },
                    { title: "Inactive", value: 2 },
                    { title: "Away", value: 3 },
                    { title: "Not Ranking", value: 4 },
                  ],
                  filterType: "status",
                },
              ]
            : [
                { Title: "Department", Atribute: "DisplayName", sort: false },
                { Title: "Name", Atribute: "DisplayName", sort: false },
                {
                  Title: "Account",
                  Atribute: "Account",
                  sort: true,
                  className: "justify-content-start",
                },
                { Title: "Job Title", Atribute: "", sort: false },

                {
                  Title: "Role",
                  filter: [
                    { title: "Member", value: 4 },
                    { title: "PM", value: 3 },
                    { title: "Head", value: 2 },
                  ],
                  filterType: "role",
                },

                { Title: "Phone Number", Atribute: "PhoneNumber", sort: false },
                { Title: "Birth Day", Atribute: "DOB", sort: false },
                { Title: "Contract Type", Atribute: "", sort: false },

                {
                  Title: "Status",
                  filter: [
                    { title: "Active", value: 1 },
                    { title: "Inactive", value: 2 },
                    { title: "Away", value: 3 },
                    { title: "Not Ranking", value: 4 },
                  ],
                  filterType: "status",
                },
              ]
        }
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

export default AllMemberList;

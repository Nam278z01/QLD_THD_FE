import RuleTable from "../../components/table/RuleTable";
import { getRule, getRuleNoPage } from "../../../../services/RuleAPI";
import useQuery from "../../../../Hook/useQuery";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import useReplaceURL from "../../../../Hook/useReplaceURL";
import { useSelector } from "react-redux";
import Loading from "../../../sharedPage/pages/Loading";
import ExportExcel from "../../components/Shared/ExportExcel";
import { useState } from "react";
import { Button } from "react-bootstrap";
import LoadingModal from "../../components/modal/LoadingModal";
import ImportRuleModal from "../../components/modal/ImportRuleExcelModal";
import { useHistory } from "react-router-dom";
import { getRuleExport } from "../../../../services/RuleAPI";

export default function RuleList() {
  const query = useQuery();

  const [showModal, setShowModal] = useState(false);
  const [showModalLoading, setShowModalLoading] = useState(false);
  const { PointName } = useSelector((a) => a.DepartmentSettingSlice);

  const searchQuery = query.get("search");
  const sortQuery = query.get("sort");
  const pageQuery = query.get("page") || 1;
  const rowQuery = query.get("row") || 10;
  const categoryQuery = query.get("category");
  const typeQuery = query.get("type");
  const statusQuery = query.get("status");
  const navigate = useHistory();

  const { role } = useSelector((state) => state.UserSlice);

  const { URLchange } = useReplaceURL(`/rule/rule-list`);

  function filterHandle(filter, type) {
    if (type === "category") {
      URLchange(
        1,
        rowQuery,
        sortQuery,
        searchQuery,
        null,
        null,
        filter,
        typeQuery ? `&type=${typeQuery}` : "",
        statusQuery ? `&status=${statusQuery}` : ""
      );
    } else if (type === "status") {
      URLchange(
        1,
        rowQuery,
        sortQuery,
        searchQuery,
        null,
        null,
        categoryQuery ? `&category=${categoryQuery}` : "",
        typeQuery ? `&type=${typeQuery}` : "",
        filter
      );
    } else if (type === "type") {
      URLchange(
        1,
        rowQuery,
        sortQuery,
        searchQuery,
        null,
        null,
        categoryQuery ? `&category=${categoryQuery}` : "",
        filter,
        statusQuery ? `&status=${statusQuery}` : ""
      );
    }
  }

  function pageChange(page) {
    URLchange(
      page,
      rowQuery,
      sortQuery,
      searchQuery,
      null,
      null,
      categoryQuery ? `&category=${categoryQuery}` : "",
      typeQuery ? `&type=${typeQuery}` : "",
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
      categoryQuery ? `&category=${categoryQuery}` : "",
      typeQuery ? `&type=${typeQuery}` : "",
      statusQuery ? `&status=${statusQuery}` : ""
    );
  }

  function sortHandle(sort) {
    URLchange(
      1,
      rowQuery,
      sort,
      searchQuery,
      null,
      null,
      categoryQuery ? `&category=${categoryQuery}` : "",
      typeQuery ? `&type=${typeQuery}` : "",
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
      categoryQuery ? `&category=${categoryQuery}` : "",
      typeQuery ? `&type=${typeQuery}` : "",
      statusQuery ? `&status=${statusQuery}` : ""
    );
  }
  const [ruleDataNoPage, setRefresh2, setData] = useRefreshToken(
    getRuleExport,
    searchQuery
  );

  let [data, setRefresh] = useRefreshToken(
    getRule,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    categoryQuery,
    typeQuery,
    statusQuery
  );
  return data === null || ruleDataNoPage === null ? (
    <Loading />
  ) : (
    <>
      <ImportRuleModal
        show={showModal}
        setShowModal={setShowModal}
        setRefresh={setRefresh}
        setShowModalLoading={setShowModalLoading}
        setRefresh2={setRefresh2}
      />
      <LoadingModal show={showModalLoading} />

      <RuleTable
        setData={setData}
        sortHandle={sortHandle}
        rowChange={rowChange}
        pageChange={pageChange}
        currentSearch={searchQuery}
        datas={data.ruleData}
        middleExtra={
          ruleDataNoPage === null || role === "Head" || role === " Admin" ? (
            <div className="d-flex justify-content-end mt-1 d-flex gap-2 align-items-center justify-content-end mt-1">
              {/* <ExportExcel
                datas={[
                  {
                    RuleType: "",
                    Name: "",
                    Category: "",
                    PointNumber: "",
                    Note: "",
                    Status: "",
                  },
                ]}
                exportName="RuleListTemlate"
                element="Template Rule"
              /> */}
              <Button
                onClick={(e) => {
                  e.target.blur();
                  navigate.push("/rule/new-rule");
                }}
              >
                New Rule <i className="fa-solid fa-plus" />
              </Button>
              <ExportExcel
                datas={ruleDataNoPage !== null ? ruleDataNoPage : []}
                exportName="RuleList"
                element="Export"
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
        thead={[
          { Title: "Rule", Atribute: "Name", sort: false },
          {
            Title: "Category",
            filter: [
              { title: "Head", value: "Head" },
              { title: "PM", value: "PM" },
              { title: "Member", value: "Member" },
            ],
            filterType: "category",
          },
          {
            Title: "Type",
            filter: [
              { title: "Minus", value: "Minus" },
              { title: "Plus", value: "Plus" },
            ],
            filterType: "type",
          },
          {
            Title: PointName,
            Atribute: "PointNumber",
            sort: true,
            className: "justify-content-center",
          },
          { Title: "Synchronize", Atribute: "Synchronize", sort: false },
          { Title: "Integrate", Atribute: "Integrate", sort: false },
          // {
          //   Title: "Badge",
          //   Atribute: "Badge",
          //   sort: false,
          // },
          {
            Title: "Note",
            Atribute: "Note",
            sort: false,
            className: "text-center",
          },

          {
            Title: "Status",
            filter: [
              { title: "Inactive", value: 2 },
              { title: "Active", value: 1 },
              // { title: "Synchronous", value: 3 },
            ],
            filterType: "status",
          },
          { Title: " ", Atribute: "", sort: false },
        ]}
        totalPage={data.totalPage}
        totalItems={data.totalItems}
        setRefresh={setRefresh}
        setRefresh2={setRefresh2}
        filterHandle={filterHandle}
        searchHandle={searchHandle}
      />
    </>
  );
}

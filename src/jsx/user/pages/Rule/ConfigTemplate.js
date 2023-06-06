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
const configTemplate = () => {
  const query = useQuery();
  const { URLchange } = useReplaceURL(`/shop`);
  const searchQuery = query.get("search");
  const rowQuery = query.get("row") || 10;
  const pageQuery = query.get("page") || 1;
  const sortQuery = query.get("sort");
  const navigate = useHistory();
  const { userID } = useSelector((state) => state.UserSlice);

  function pageChange(page) {
    URLchange(page, rowQuery, sortQuery, searchQuery);
  }
  function rowChange(row) {
    URLchange(1, row, sortQuery, searchQuery);
  }
  function searchHandleUtil(search) {
    URLchange(1, rowQuery, sortQuery, search);
  }
  const [templateList, setTemplateList] = useState([
    {
      TemplateID: 1,
      TemplateName: "ABC",
      RuleUsing: [1000, 1001],
      CreatedBy: { Account: "ABC" },
      DateOfCreated: "5/5/1000",
    },
  ]);

  const [pageNum, setPageNum] = useState(1);
  const [tab, setTab] = useState(false); /// state 0 tab shop state 1 tab personalShop

  return templateList === null ? (
    <Loading />
  ) : (
    <>
      <div class="container ">
        <div class="row d-flex justify-content-center align-items-center ">
          <div class="col-md-12 col-xl-10">
            <div class="card mask-custom">
              <div class="card-body p-4 text-white">
                <div class="text-center pt-3 pb-2">
                  <h2 class="my-4">Template List</h2>
                </div>

                <table class="table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Template Name</th>
                      <th scope="col">Rule Using</th>
                      <th scope="col">Created By</th>
                      <th scope="col">Date of Created</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "black" }}>
                    {templateList.map((x, i) => (
                      <tr class="fw-normal">
                        <th>
                          <span class="ms-2">{x.TemplateName}</span>
                        </th>
                        <td class="align-middle">{x.TemplateName}</td>
                        <td class="align-middle">{x.CreatedBy.Account}</td>
                        <td class="align-middle">{x.DateOfCreated}</td>
                        <td class="align-middle">
                          <Button
                            data-mdb-toggle="tooltip"
                            title="Remove"
                            onClick={() => {
                              navigate.push(`/editTemplate/${x.TemplateID}`);
                            }}
                          >
                            View Detail
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default configTemplate;

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
import { Modal } from "react-bootstrap";
import AddTemplateRuleModal from "../../components/modal/AddTemplateRuleModal";
import React from "react";
import Select from "react-select";

const templateDetail = () => {
  const query = useQuery();
  const { URLchange } = useReplaceURL(`/shop`);
  const searchQuery = query.get("search");
  const rowQuery = query.get("row") || 10;
  const pageQuery = query.get("page") || 1;
  const sortQuery = query.get("sort");
  const navigate = useHistory();
  const { userID } = useSelector((state) => state.UserSlice);
  const [show, setShow] = useState(false);
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  function pageChange(page) {
    URLchange(page, rowQuery, sortQuery, searchQuery);
  }
  function rowChange(row) {
    URLchange(1, row, sortQuery, searchQuery);
  }
  function parseExpression(str) {
    // break string into tokens, in reverse order because pop() is faster than shift()
    const tokens = str.match(/[.0-9Ee]+|[^\s]/g).reverse();
    const tree = parseTokens(tokens, 0);
    if (tokens.length) {
      throw new Error(`Unexpected ${tokens.pop()} after expression`);
    }
    return tree;
  }

  const BINARY_PRECEDENCE = {
    "+": 0,
    "-": 0,
    "*": 1,
    "/": 1,
  };

  const UNARY_PRECEDENCE = {
    "+": 10,
    "-": 10,
  };

  /**
   * Given an array of tokens in reverse order, return binary expression tree
   *
   * @param tokens {string[]} tokens
   * @param minPrec {number} stop at operators with precedence smaller than this
   */
  function parseTokens(tokens, minPrec) {
    if (!tokens.length) {
      throw new Error("Unexpected end of expression");
    }

    // get the left operand
    let leftToken = tokens.pop();
    let leftVal;
    if (leftToken === "(") {
      leftVal = parseTokens(tokens, 0);
      if (tokens.pop() !== ")") {
        throw new Error("Unmatched (");
      }
    } else if (UNARY_PRECEDENCE[leftToken] != undefined) {
      const operand = parseTokens(tokens, UNARY_PRECEDENCE[leftToken]);
      if (typeof operand === "number" && leftToken === "-") {
        leftVal = -operand;
      } else if (typeof operand === "number" && leftToken === "+") {
        leftVal = operand;
      } else {
        leftVal = {
          operation: leftToken,
          values: [operand],
        };
      }
    } else {
      leftVal = Number(leftToken);
      if (isNaN(leftVal)) {
        throw new Error(`invalid number ${leftToken}`);
      }
    }

    // Parse binary operators until we hit the end or a stop
    while (tokens.length) {
      // end of expression
      const opToken = tokens.pop();
      const opPrec = BINARY_PRECEDENCE[opToken];
      if (opToken === ")" || (opPrec != undefined && opPrec < minPrec)) {
        // We have to stop here.  put the token back and return
        tokens.push(opToken);
        return leftVal;
      }
      if (opPrec == undefined) {
        throw new Error(`invalid operator ${opToken}`);
      }

      // we have a binary operator.  Get the right operand
      const operand = parseTokens(tokens, opPrec + 1);
      if (typeof leftVal === "object" && leftVal.operation === opToken) {
        // Extend the existing operation
        leftVal.values.push(operand);
      } else {
        // Need a new operation
        leftVal = {
          values: [leftVal, operand],
          operation: opToken,
        };
      }
    }
    return leftVal;
  }

  function searchHandleUtil(search) {
    URLchange(1, rowQuery, sortQuery, search);
  }
  const [templateList, setTemplateList] = useState({
    TemplateID: 1,
    TemplateName: "ABC",
    RuleUsing: [{ RuleName: "rule 1", PointOfRule: 50 }, {}],
    CreatedBy: { Account: "ABC" },
    DateOfCreated: "5/5/1000",
  });

  const [pageNum, setPageNum] = useState(1);
  const [tab, setTab] = useState(false); /// state 0 tab shop state 1 tab personalShop

  return templateList === null ? (
    <Loading />
  ) : (
    <>
      <AddTemplateRuleModal show={show} setShow={setShow} setRefresh={false} />
      <div className="container " style={{ width: "100%" }}>
        <div className="row d-flex justify-content-center align-items-center ">
          <div className="col-md-12 col-xl-10">
            <div className="card ">
              <div className="card-body p-4 text-white">
                <div className="text-center pt-3 pb-2">
                  <h2 className="my-4">Template Detail</h2>
                </div>

                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Template Name</th>
                      <th scope="col">Value Start Line</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "black" }}>
                    <tr className="fw-normal">
                      <th>
                        <span className="ms-2">
                          <input
                            defaultValue={templateList.TemplateName}
                            type="text"
                          ></input>
                        </span>
                      </th>
                      <td className="align-middle">
                        <input type="number"></input>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="table ">
                  <thead>
                    <tr>
                      <th scope="col">Account Row</th>
                      <th scope="col">Project Code Row</th>
                      <th scope="col">Note Row</th>
                      <th scope="col">Month Row</th>
                      <th scope="col">Year Row</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "black" }}>
                    <tr className="fw-normal">
                      <td className="align-middle">
                        <input style={{ width: "100%" }} type="number"></input>
                      </td>
                      <td className="align-middle">
                        <input style={{ width: "100%" }} type="number"></input>
                      </td>
                      <td className="align-middle">
                        <input style={{ width: "100%" }} type="number"></input>
                      </td>
                      <td className="align-middle">
                        <input style={{ width: "100%" }} type="number"></input>{" "}
                      </td>
                      <td className="align-middle">
                        <input style={{ width: "100%" }} type="number"></input>{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="table ">
                  <thead>
                    <tr>
                      <th scope="col">A</th>
                      <th scope="col">B</th>
                      <th scope="col">Cote Row</th>
                      <th scope="col">Donth Row</th>
                      <th scope="col">Eear Row</th>
                      <th scope="col">Fear Row</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "black" }}>
                    <tr className="fw-normal">
                      <td className="align-middle">1 </td>
                      <td className="align-middle">2 </td>
                      <td className="align-middle">3 </td>
                      <td className="align-middle">4 </td>
                      <td className="align-middle">5 </td>
                      <td className="align-middle">6 </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card mask-custom">
              <div className="card-body p-4 text-white">
                <div className="text-center pt-3 pb-2">
                  <h2 className="my-4">Rule List</h2>
                </div>
                <div style={{ border: "1px solid gray " }}>
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Rule Name</th>
                        <th scope="col">Point of Rule</th>
                        <th scope="col">Times</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: "black" }}>
                      <tr className="fw-normal">
                        <th>
                          <Select options={options} />
                        </th>
                        <td className="align-middle">
                          <input
                            type="number"
                            defaultValue={templateList.RuleUsing[0].PointOfRule}
                          ></input>
                        </td>
                        <td className="align-middle">
                          <input type="number"></input>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Rule Condition</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: "black" }}>
                      <tr className="fw-normal">
                        <th>
                          <span className="ms-2">
                            <input style={{ width: "50%" }} type="text"></input>
                          </span>
                        </th>
                      </tr>
                    </tbody>
                  </table>
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Rule Calculation Formula</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: "black" }}>
                      <tr className="fw-normal">
                        <th>
                          <span className="ms-2">
                            <input
                              id="caculationFormula"
                              style={{ width: "50%" }}
                              type="text"
                            ></input>
                          </span>
                        </th>
                      </tr>
                    </tbody>
                  </table>
                  <div id="formulaAlert" hidden="true" style={{ color: "red" }}>
                    Input must match the format
                  </div>
                </div>
              </div>
              <div>
                {" "}
                <Button
                  data-mdb-toggle="tooltip"
                  style={{ width: "15%", float: "right" }}
                  title="Remove"
                  className="m-2"
                  onClick={() => {
                    let pattern = /[\d\[\]\+\-\*\/]/;
                    let test = true;
                    let text =
                      document.getElementById("caculationFormula").value;
                    let element = text.split("");
                    element.forEach((element) => {
                      if (!pattern.test(element)) {
                        document.getElementById("formulaAlert").hidden = false;
                        test = false;
                      }
                    });
                    if (test)
                      document.getElementById("formulaAlert").hidden = true;

                    const compute = (str = "") => {
                      let total = 0;
                      str = str.match(/[+\−]*(\.\d+|\d+(\.\d+)?)/g) || [];
                      while (str.length) {
                        total += parseFloat(str.shift());
                      }
                      return total;
                    };
                  }}
                >
                  Edit
                </Button>
                <Button
                  data-mdb-toggle="tooltip"
                  style={{ width: "15%", float: "right" }}
                  title="Remove"
                  className="m-2"
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  Add new rule
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default templateDetail;

import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment/moment";
import { Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import TableHeadAndFoot from "./TableHeadAndFoot";

const ProjectTable = (props) => {
  const {
    datas,
    thead,
    totalPage,
    totalItems,
    type,
    middleExtra,
    pageChange,
    rowChange,
    sortHandle,
    searchHandle,
    filterHandle,
    currentSearch,
  } = props;
  const navigate = useHistory();

  const { Code } = useSelector((a) => a.DepartmentSettingSlice);

  function goToDetailProject(id) {
    navigate.push(`/${type}/project-detail/${id}`);
  }

  const role = useSelector((state) => state.UserSlice.role);
  return (
    <>
      <TableHeadAndFoot
        currentSearch={currentSearch}
        title="Project List"
        thead={thead}
        totalPage={totalPage}
        totalItems={totalItems}
        project
        middleExtra={middleExtra}
        pageChange={pageChange}
        rowChange={rowChange}
        sortHandle={sortHandle}
        searchHandle={searchHandle}
        filterHandle={filterHandle}
      >
        {datas.length > 0 ? (
          datas.map((data, index) => (
            <tr
              role="row"
              className={`${role && "mousePointer "}`}
              key={index}
              onClick={() => {
                goToDetailProject(data.projectID);
              }}
            >
              {/* <td style={{ width: "10%" }}>
                <div className="concierge-bx align-items-center">
                  <h6 className="mb-0 text-truncate" title={data.key}>
                    {data.key}
                  </h6>
                </div>
              </td> */}
              <td className="text-center" style={{ width: "20%" }}>
                <div className="concierge-bx align-items-center">
                  <h6 className="mb-0 text-truncate" title={data.code}>
                    {data.code}
                  </h6>
                </div>
              </td>

              <td style={{ width: "15%" }} className="text-center">
                <span className="font-w500">{data.manager}</span>
              </td>

              <td style={{ width: "15%" }}>
                <span className="font-w500">{data.department}</span>
              </td>

              <td style={{ width: "15%" }}>
                <span className="font-w500">
                  {moment(data.startdate).format("DD-MM-YYYY")}
                </span>
              </td>

              <td style={{ width: "15%" }}>
                <span className="font-w500">
                  {moment(data.enddate).format("DD-MM-YYYY")}
                </span>
              </td>

              <td className="text-center" style={{ width: "10%" }}>
                {data.status === "On-going" && (
                  <Badge bg="primary">{data.status}</Badge>
                )}

                {data.status === "Closed" && (
                  <Badge bg="danger light">{data.status}</Badge>
                )}

                {data.status === "Tentative" && (
                  <Badge bg="secondary light">{data.status}</Badge>
                )}

                {data.status === "Cancelled" && (
                  <Badge bg="secondary light">{data.status}</Badge>
                )}
                {data.status === "Waiting" && (
                  <Badge bg="warning text-dark">{data.status}</Badge>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr className="text-center">
            <td colSpan={thead.length}>
              <h4>No Data</h4>
            </td>
          </tr>
        )}
      </TableHeadAndFoot>
    </>
  );
};
export default ProjectTable;

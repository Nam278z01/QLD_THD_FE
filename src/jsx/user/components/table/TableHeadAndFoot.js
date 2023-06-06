import CardTitleWithSearch from "../Card/CardTitleWithSearch";
import TableHeadWithSort from "./TableHeadWithSort";
import CustomPagination from "../Shared/CustomPagination";
import { Table } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import useReplaceURL from "../../../../Hook/useReplaceURL";
import useQuery from "../../../../Hook/useQuery";

const TableHeadAndFoot = ({
  children,
  title,
  thead,
  page,
  totalPage,
  totalItems,
  showCustomBar,
  customBar,
  extraHeader,
  extraHead,
  className,
  rowChange,
  searchHandle,
  sortHandle,
  pageChange,
  filterHandle,
  theCurrentSort,
  noRowChange,
  hidePagi,
  noSearch,
  currentSearch,
  middleExtra,
  overPage,
  setChoosenStatus,
}) => {
  const navigate = useHistory();
  const { search } = useLocation();
  const { URLchange } = useReplaceURL(navigate.location.pathname);

  const query = useQuery();
  const searchQuery = query.get("search");
  const sortQuery = search.split("&").filter((x) => x.includes("sort="));

  const rowQuery = query.get("row") || 10;

  function pageChangeUtil(page) {
    URLchange(page, rowQuery, "", searchQuery);
  }

  function rowChangeUtil(row) {
    URLchange(1, row, "", searchQuery);
  }

  function sortHandleUtil(toSort) {
    URLchange(1, rowQuery, toSort, searchQuery);
  }

  function searchHandleUtil(search) {
    URLchange(1, rowQuery, "", search);
  }
  return (
    <div className={`card ${className}`}>
      <CardTitleWithSearch
        noSearch={noSearch}
        title={title}
        searchHandle={searchHandle ? searchHandle : searchHandleUtil}
        currentSearch={currentSearch}
        middleExtra={middleExtra}
      />
      {extraHead && extraHead}
      <div className="card-body">
        <Table
          responsive
          className="table display mb-4 shadow-hover dataTable no-footer"
        >
          <thead>
            <tr role="row" >
              {extraHeader}
              {showCustomBar ? (
                customBar
              ) : (
                <TableHeadWithSort
                  thead={thead}
                  sortHandle={sortHandle ? sortHandle : sortHandleUtil}
                  theCurrentSort={theCurrentSort ? theCurrentSort : sortQuery}
                  filterHandle={filterHandle}
                  setChoosenStatus={setChoosenStatus}
                />
              )}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </Table>

        <div className="row align-items-end justify-content-end">
          <div className="col-auto" style={{padding: "0.375rem 2.25rem 0.375rem 0.75rem"}}>
          <span>Total: {totalItems ? totalItems : 0} </span>
          </div>
          <div className="col-auto">
            {!hidePagi && (
              <CustomPagination
                overPage={overPage}
                noRowChange={noRowChange}
                page={page}
                totalPage={totalPage ? totalPage : 1}
                pageChange={pageChange ? pageChange : pageChangeUtil}
                rowChange={rowChange ? rowChange : rowChangeUtil}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableHeadAndFoot;

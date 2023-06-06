import { Modal, Form, Table, Button } from "react-bootstrap";
import { useRef } from "react";
import TableHeadWithSort from "../table/TableHeadWithSort";
import CustomPagination from "../Shared/CustomPagination";
import { useHistory } from "react-router-dom";
import useQuery from "../../../../Hook/useQuery";
import useReplaceURL from "../../../../Hook/useReplaceURL";

const ModalHeadAndFoot = ({
  children,
  title,
  thead,
  page,
  totalPage,
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
  middleExtra,
  noSearch,
  currentSearch,
  searchClass,
}) => {
  const searchRef = useRef();

  function formHandle(e) {
    e.preventDefault();
    searchHandle(searchRef.current.value);
  }

  const navigate = useHistory();

  const { URLchange } = useReplaceURL(navigate.location.pathname);

  const query = useQuery();
  const searchQuery = query.get("search");
  const sortQuery = query.get("sort");
  const rowQuery = query.get("row") || 10;

  function pageChangeUtil(page) {
    URLchange(page, rowQuery, sortQuery, searchQuery);
  }

  function rowChangeUtil(row) {
    URLchange(1, row, sortQuery, searchQuery);
  }

  function sortHandleUtil(toSort) {
    URLchange(1, rowQuery, toSort, searchQuery);
  }

  function searchHandleUtil(search) {
    URLchange(1, rowQuery, sortQuery, search);
  }

  return (
    <>
      <Modal.Header>
        <div className="col-12 col-md-8">
          <h4 className="card-title user-select-none text-center text-md-start mb-2 m-md-0">
            {title}
          </h4>
        </div>
        <div className="col-md-4 col-12">
          {!noSearch && (
            <Form
              className={`d-flex align-items-center mb-1 ${searchClass}`}
              onSubmit={formHandle}
            >
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 h-25 m-0"
                aria-label="Search"
                onBlur={() => {
                  searchHandle
                    ? searchHandle(searchRef.current.value)
                    : searchHandleUtil(searchRef.current.value);
                }}
                ref={searchRef}
                defaultValue={currentSearch}
              />
              <Button
                onClick={(e) => {
                  formHandle(e);
                  e.target.blur();
                }}
              >
                <i className="fas fa-magnifying-glass" />
              </Button>
            </Form>
          )}
        </div>
        {middleExtra && <div className="col-12">{middleExtra}</div>}
        {extraHead && extraHead}
      </Modal.Header>
      <Modal.Body>
        <Table
          responsive
          className="table display mb-4 shadow-hover dataTable no-footer"
        >
          <thead>
            <tr role="row" className="user-select-none">
              {extraHeader}
              {showCustomBar ? (
                customBar
              ) : (
                <TableHeadWithSort
                  thead={thead}
                  sortHandle={sortHandle ? sortHandle : sortHandleUtil}
                  theCurrentSort={theCurrentSort ? theCurrentSort : sortQuery}
                  filterHandle={filterHandle}
                />
              )}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </Table>
      </Modal.Body>
      {!hidePagi && (
        <Modal.Footer>
          <CustomPagination
            noRowChange={noRowChange}
            page={page}
            totalPage={totalPage ? totalPage : 1}
            pageChange={pageChange ? pageChange : pageChangeUtil}
            rowChange={rowChange ? rowChange : rowChangeUtil}
          />
        </Modal.Footer>
      )}
    </>
  );
};

export default ModalHeadAndFoot;

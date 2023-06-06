import { useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import useQuery from "../../../../Hook/useQuery";
import useReplaceURL from "../../../../Hook/useReplaceURL";
import CustomPagination from "./CustomPagination";

const CustomCardUtil = ({
  children,
  title,
  page,
  totalPage,
  className,
  rowChange,
  searchHandle,
  pageChange,
  filterHandle,
  noRowChange,
  hidePagi,
  noSearch,
  currentSearch,
  middleExtra,
  row,
}) => {
  const query = useQuery();
  const searchQuery = query.get("search");
  const sortQuery = query.get("sort");
  const rowQuery = row || query.get("row") || 10;

  const searchRef = useRef();
  const navigate = useHistory();
  const { URLchange } = useReplaceURL(navigate.location.pathname);

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

  function formHandle(e) {
    e.preventDefault();
    searchHandleUtil(searchRef.current.value);
  }

  return (
    <div>
      <div className="row m-0 py-3 align-items-center justify-content-end">
        {middleExtra && <div className="col-9">{middleExtra}</div>}
        <div className="col-md-3 col-12 p-0">
          {!noSearch && (
            <Form
              className={`d-flex align-items-center mb-1 `}
              onSubmit={formHandle}
            >
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 h-25 m-0"
                aria-label="Search"
                onBlur={(e) => {
                  searchHandleUtil(searchRef.current.value);
                }}
                ref={searchRef}
                defaultValue={currentSearch}
              />
              <Button
                variant="primary"
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
      </div>
      <div>{children}</div>
      {!hidePagi && (
        <div className="d-flex justify-content-center">
          <CustomPagination
            noRowChange={noRowChange}
            page={page}
            row={row}
            totalPage={totalPage ? totalPage : 1}
            pageChange={pageChange ? pageChange : pageChangeUtil}
            rowChange={rowChange ? rowChange : rowChangeUtil}
            // pagePosition="center"
            rowOption={[10, 20, 50, "All"]}
          />
        </div>
      )}
    </div>
  );
};

export default CustomCardUtil;

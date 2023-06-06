import { useEffect, useState } from "react";
import { Nav, Pagination } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import useQuery from "../../../../Hook/useQuery";

const CustomPagination = (props) => {
  const {
    row,
    page,
    totalPage,
    pageChange,
    rowChange,
    rowEvent,
    noRowChange,
    pagePosition,
    rowOption,
    overPage,
  } = props;

  const [items, setItems] = useState([]);

  const threeDot = (
    <li className="page-item pe-none" key={"..."}>
      <a className="page-link">...</a>
    </li>
  );

  const query = useQuery();
  const pageQuery = page || +query.get("page") || 1;
  const rowQuery = row || query.get("row") || 10;

  const searchHistory = useHistory().location.search;
  useEffect(() => {
    if (pageQuery > totalPage && pageQuery != 1 && !overPage) {
      pageChange(totalPage);
    }
    let items = [];

    if (totalPage <= 7) {
      for (let fisrtPage = 1; fisrtPage <= totalPage; fisrtPage++) {
        items.push(
          <Pagination.Item
            key={fisrtPage}
            active={fisrtPage === pageQuery}
            onClick={(e) => {
              if (fisrtPage === pageQuery) {
                return;
              } else pageChange(fisrtPage);
            }}
            value={fisrtPage}
          >
            {fisrtPage}
          </Pagination.Item>
        );
      }
    } else if (pageQuery <= totalPage && pageQuery > totalPage - 3) {
      items.push(
        <Pagination.Item
          key={1}
          active={pageQuery === 1}
          onClick={() => {
            if (pageQuery === 1) {
              return;
            } else pageChange(1);
          }}
          value={1}
        >
          {1}
        </Pagination.Item>
      );

      items.push(threeDot);

      for (let firstPage = totalPage - 3; firstPage <= totalPage; firstPage++) {
        items.push(
          <Pagination.Item
            key={firstPage}
            active={firstPage === pageQuery}
            onClick={() => {
              if (firstPage === pageQuery) {
                return;
              } else pageChange(firstPage);
            }}
            value={firstPage}
          >
            {firstPage}
          </Pagination.Item>
        );
      }
    } else if (pageQuery <= 3) {
      for (let firstPage = 1; firstPage <= 4; firstPage++) {
        items.push(
          <Pagination.Item
            key={firstPage}
            active={firstPage === pageQuery}
            onClick={() => {
              if (firstPage === pageQuery) {
                return;
              } else pageChange(firstPage);
            }}
            value={firstPage}
          >
            {firstPage}
          </Pagination.Item>
        );
      }

      items.push(threeDot);

      items.push(
        <Pagination.Item
          key={totalPage}
          active={pageQuery === totalPage}
          onClick={() => {
            if (pageQuery === totalPage) {
              return;
            } else pageChange(totalPage);
          }}
          value={totalPage}
        >
          {totalPage}
        </Pagination.Item>
      );
    } else if (pageQuery > 3 && pageQuery < totalPage) {
      items.push(
        <Pagination.Item
          key={1}
          active={pageQuery === 1}
          onClick={() => {
            if (pageQuery === 1) {
              return;
            } else pageChange(1);
          }}
          value={1}
        >
          {1}
        </Pagination.Item>
      );

      items.push(
        <li className="page-item pe-none" key={"...1"}>
          <a className="page-link">...</a>
        </li>
      );

      items.push(
        <Pagination.Item key={pageQuery} active={true} value={pageQuery}>
          {pageQuery}
        </Pagination.Item>
      );

      items.push(
        <Pagination.Item
          key={pageQuery + 1}
          active={false}
          value={pageQuery + 1}
          onClick={() => {
            pageChange(pageQuery + 1);
          }}
        >
          {pageQuery + 1}
        </Pagination.Item>
      );

      items.push(
        <li className="page-item pe-none" key={"...2"}>
          <a className="page-link">...</a>
        </li>
      );

      items.push(
        <Pagination.Item
          key={totalPage}
          active={pageQuery === totalPage}
          onClick={() => {
            if (pageQuery === totalPage) {
              return;
            } else pageChange(totalPage);
          }}
          value={totalPage}
        >
          {totalPage}
        </Pagination.Item>
      );
    }
    setItems(items);
  }, [totalPage, searchHistory, pageQuery]);
  const pag = (size, gutter, variant, bg, circle) => (
    <div>
      {rowQuery === "All" && !noRowChange && (
        <select
          className="page-item d-none d-md-block form-select bg-transparent"
          defaultValue={typeof rowQuery === "string" ? rowQuery : +rowQuery}
          onChange={(e) => {
            rowChange(e.target.value);
          }}
        >
          {(rowOption || [10, 20, 30, "All"]).map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {rowQuery !== "All" && (
        <Pagination
          size={size}
          className={`${gutter ? "pagination-gutter" : ""} ${
            variant && `pagination-${variant}`
          } ${!bg && "no-bg"} ${circle && "pagination-circle"}`}
        >
          {!noRowChange && (
            <select
              className="page-item d-none d-md-block form-select bg-transparent"
              defaultValue={typeof rowQuery === "string" ? rowQuery : +rowQuery}
              onChange={(e) => {
                rowChange(e.target.value);
              }}
            >
              {(rowOption || [10, 20, 30, "All"]).map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {totalPage !== 1 && (
            <>
              <Pagination.Item
                className={`page-item page-indicator ${
                  pageQuery > 1 ? "" : "pe-none"
                }`}
                onClick={() => {
                  pageChange(pageQuery - 1);
                }}
              >
                <i className="la la-angle-left" />
              </Pagination.Item>
              {items}
              <Pagination.Item
                className={`page-item page-indicator ${
                  pageQuery < totalPage ? "" : "pe-none"
                }`}
                onClick={() => {
                  pageChange(pageQuery + 1);
                }}
              >
                <i className="la la-angle-right" />
              </Pagination.Item>
            </>
          )}
        </Pagination>
      )}
    </div>
  );

  return rowQuery === "All" ? (
    <div
      className={`d-flex justify-content-end w-100 align-items-end ${props.className} user-select-none col-12`}
    >
      <div className="col-12 justify-content-end d-md-flex d-none">
        <Nav>{pag("", true, "", true, false)}</Nav>
      </div>
      <div className="col-12 justify-content-end d-flex d-md-none">
        <Nav>{pag("sm", true, "", true, false)}</Nav>
      </div>
    </div>
  ) : (
    <div
      className={`justify-content-between w-100 align-items-center ${props.className} user-select-none m-0`}
    >
      <div
        className={`col-12 justify-content-${
          pagePosition || "end"
        } d-md-flex d-none`}
      >
        <Nav>{pag("", true, "", true, false)}</Nav>
      </div>
      <div className={`col-12 justify-content-center d-flex d-md-none`}>
        <Nav>{pag("sm", true, "", true, false)}</Nav>
      </div>
    </div>
  );
};

export default CustomPagination;

import { useState } from "react";

const TableHeadWithSort = (props) => {
  const { thead, sortHandle, theCurrentSort, filterHandle, setChoosenStatus } =
    props;
  const [currentSort, setCurrentSort] = useState(
    theCurrentSort ? theCurrentSort : ""
  );
  return thead.map((data, index) =>
    data.sort ? (
      <th
        style={{ width: "200px" }}
        key={index}
        onClick={() => {
          if (currentSort === `${data.Atribute}:ASC`) {
            setCurrentSort(`${data.Atribute}:DESC`);
            sortHandle(`${data.Atribute}:DESC`);
          } else if (currentSort === `${data.Atribute}:DESC`) {
            setCurrentSort(``);
            sortHandle(``);
          } else {
            setCurrentSort(`${data.Atribute}:ASC`);
            sortHandle(`${data.Atribute}:ASC`);
          }
        }}
        className={`user-select-none ${data.className}`}
      >
        <div
          className={`d-flex flex-row gap-1 h-100 mousePointer ${data.className}`}
        >
          {data.Title}
          {currentSort === `${data.Atribute}:ASC` ? (
            <i className="fa-solid fa-arrow-up-wide-short text-primary mt-1"></i>
          ) : currentSort === `${data.Atribute}:DESC` ? (
            <i className="fa-solid  fa-arrow-down-wide-short text-primary mt-1"></i>
          ) : (
            <i className="fa-solid fa-arrow-down-wide-short text-muted mt-1"></i>
          )}
        </div>
      </th>
    ) : data.filter ? (
      <th style={{ width: "10vw" }} key={index}>
        <select
          className="form-select w-100"
          style={{ fontWeight: 600 }}
          onChange={(e) => {
            if (e.target.value != 0) {
              if (typeof setChoosenStatus === "function")
                setChoosenStatus(e.target.value);
              filterHandle(
                `&${data.filterType}=${e.target.value}`,
                data.filterType
              );
            } else {
              if (typeof setChoosenStatus === "function")
                setChoosenStatus(e.target.value);
              filterHandle("", data.filterType);
            }
          }}
        >
          <option value={0}>{data.Title}</option>
          {data.filter.map((x, i) => (
            <option value={x.value} key={i}>
              {x.title}
            </option>
          ))}
        </select>
      </th>
    ) : (
      <th
        style={{ width: "100px" }}
        key={index}
        className={`col-2 user-select-none ${data.className}`}
      >
        {data.Title}
      </th>
    )
  );
};

export default TableHeadWithSort;

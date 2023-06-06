import HistoryTable from "../table/HistoryTable";
import { getHistory } from "../../../../services/RequestAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { Modal, ModalHeader } from "react-bootstrap";
import { useState } from "react";
import { createPortal } from "react-dom";
import Loading from "../../../sharedPage/pages/Loading";
import { useSelector } from "react-redux";
const ConfirmDeleteLocation = document.getElementById("confirmDelete");

const HistoryModal = ({
  userID,
  month,
  year,
  name,
  show,
  setShow,
  MonthOnly,
}) => {
  const [page, setPage] = useState(1);
  const [row, setRow] = useState(5);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const { PointName } = useSelector((a) => a.DepartmentSettingSlice);

  function pageChange(page) {
    setPage(page);
  }

  function rowChange(row) {
    setRow(row);
  }

  function sortHandle(sort) {
    setSort(sort);
    setPage(1);
  }

  function searchHandle(search) {
    setSearch(search);
    setPage(1);
  }

  const [data] = useRefreshToken(
    getHistory,
    month,
    year,
    page,
    row,
    sort,
    search,
    userID
  );

  const columns = [
    {
      Title: "Year",
      Atribute: "Year",
      sort: true,
      className: "justify-content-center text-center",
    },
    {
      Title: "Month",
      Atribute: "Month",
      sort: true,
      className: "justify-content-center text-center",
    },

    { Title: "Project", Atribute: "", sort: false },
    { Title: "Rule", Atribute: "", sort: false },
    {
      Title: PointName,
      Atribute: "PointOfRule",
      sort: true,
      className: "justify-content-center",
    },

    {
      Title: "Times",
      Atribute: "Times",
      sort: true,
      className: "justify-content-center",
    },
    { Title: "Note", Atribute: "", sort: false },
    {
      Title: "Created Date",
      Atribute: "",
      sort: false,
      className: "text-center",
    },
  ];
  function off() {
    setShow(false);
  }
  const element = (
    <Modal
      show={show}
      centered
      onHide={() => {
        setPage(1);
      }}
      size="xl"
      scrollable={true}
    >
      <ModalHeader className="d-flex justify-content-end">
        <div>
          <button className="btn btn-outline-secondary" onClick={off}>
            <i className="fas fa-x" />
          </button>
        </div>
      </ModalHeader>
      {data === null ? (
        <Loading />
      ) : (
        <HistoryTable
          MonthOnly={MonthOnly}
          columns={columns}
          data={data.historyData}
          name={name}
          page={page * 1}
          sortHandle={sortHandle}
          searchHandle={searchHandle}
          rowChange={rowChange}
          pageChange={pageChange}
          totalPage={data.totalPage}
        />
      )}
    </Modal>
  );

  return createPortal(element, ConfirmDeleteLocation);
};

export default HistoryModal;

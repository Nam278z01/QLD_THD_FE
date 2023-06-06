import ModalHeadAndFoot from "../modal/ModalHeadAndFoot";
import TableHeadAndFoot from "./TableHeadAndFoot";

const HistoryTable = (props) => {
  const {
    data,
    columns,
    name,
    sortHandle,
    searchHandle,
    page,
    pageChange,
    totalPage,
    rowChange,
    MonthOnly,
  } = props;
  return data === null ? (
    <></>
  ) : (
    <ModalHeadAndFoot
      title={`History Of ${name}`}
      thead={columns}
      page={page}
      totalPage={totalPage}
      pageChange={pageChange}
      sortHandle={sortHandle}
      searchHandle={searchHandle}
      rowChange={rowChange}
      noRowChange={true}
      className="m-0"
    >
      {data.length > 0 ? (
        data.map((d, i) => (
          <tr key={i} style={{ height: "120px" }}>
            <td style={{ width: "5%" }} className="text-center">
              {d.Year}
            </td>
            <td style={{ width: "5%" }} className="text-center">
              {d.Month}
            </td>
            <td style={{ width: "12%" }}>
              <h6>{d.Key}</h6>
            </td>
            <td style={{ maxWidth: "15vw", wordWrap: "break-word" }}>
              {d.Name.length >= 70 ? d.Name.substring(0, 70) + "..." : d.Name}
            </td>
            <td className="text-center" style={{ width: "5%" }}>
              {d.PointOfRule}
            </td>
            <td className="text-center" style={{ width: "5%" }}>
              {d.Times}
            </td>
            <td style={{ width: "20%" }}>{d.Comment}</td>
            <td style={{ width: "10%" }} className="text-center">
              {d.CreatedDate}
            </td>
          </tr>
        ))
      ) : (
        <tr className="text-center">
          <td colSpan={columns.length}>
            <h4>No Data</h4>
          </td>
        </tr>
      )}
    </ModalHeadAndFoot>
  );
};

export default HistoryTable;

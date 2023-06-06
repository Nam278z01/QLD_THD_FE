import MyRequestTable from "../../components/table/MyRequestTable";
import { getMyRequest } from "../../../../services/RequestAPI";
import useQuery from "../../../../Hook/useQuery";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { useSelector } from "react-redux";
import useReplaceURL from "../../../../Hook/useReplaceURL";
import Loading from "../../../sharedPage/pages/Loading";

const MyRequestList = () => {
  const query = useQuery();
  const searchQuery = query.get("search");
  const sortQuery = query.get("sort");
  const pageQuery = query.get("page") || 1;
  const rowQuery = query.get("row") || 10;
  const statusQuery = query.get("status");

  const { userID } = useSelector((state) => state.UserSlice);
  const { PointName } = useSelector((a) => a.DepartmentSettingSlice);

  const [data, setRefresh] = useRefreshToken(
    getMyRequest,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    statusQuery,
    userID
  );

  const { URLchange } = useReplaceURL(`/point/my-request`);

  function pageChange(page) {
    URLchange(
      page,
      rowQuery,
      sortQuery,
      searchQuery,
      null,
      null,
      statusQuery ? `&status=${statusQuery}` : ""
    );
  }

  function rowChange(row) {
    URLchange(
      1,
      row,
      sortQuery,
      searchQuery,
      null,
      null,
      statusQuery ? `&status=${statusQuery}` : ""
    );
  }

  function sortHandle(toSort) {
    URLchange(
      1,
      rowQuery,
      toSort,
      searchQuery,
      null,
      null,
      statusQuery ? `&status=${statusQuery}` : ""
    );
  }

  function searchHandle(search) {
    URLchange(
      1,
      rowQuery,
      sortQuery,
      search,
      null,
      null,
      statusQuery ? `&status=${statusQuery}` : ""
    );
  }

  function filterHandle(filter, type) {
    URLchange(1, rowQuery, sortQuery, searchQuery, null, null, filter);
  }

  return data === null ? (
    <Loading />
  ) : (
    <MyRequestTable
      currentSearch={searchQuery}
      pageChange={pageChange}
      rowChange={rowChange}
      sortHandle={sortHandle}
      searchHandle={searchHandle}
      filterHandle={filterHandle}
      datas={data.requestData}
      totalItems={data.totalItems}
      status={false}
      setRefresh={setRefresh}
      thead={[
        { Title: "Confirm By", Atribute: "", sort: false },

        { Title: "Approver", Atribute: "", sort: false },

        { Title: "Project", Atribute: "", sort: false },
        {
          Title: PointName,
          Atribute: "PointOfRule",
          sort: true,
          className: "justify-content-center",
        },
        { Title: "Rule", Atribute: "", sort: false },

        {
          Title: "Times",
          Atribute: "Times",
          sort: true,
          className: "justify-content-center",
        },
        {
          Title: "Year",
          Atribute: "Year",
          sort: true,
          className: "justify-content-center",
        },
        {
          Title: "Month",
          Atribute: "Month",
          sort: true,
          className: "justify-content-center",
        },

        {
          Title: "Status",
          filter: [
            { title: "Waiting PM Confirm", value: 1 },
            { title: "Waiting Head Approve", value: 2 },
            { title: "Approved", value: 3 },
            { title: "Rejected", value: 4 },
            { title: "Cancelled", value: 5 },
          ],
          filterType: "status",
        },
      ]}
      totalPage={data.totalPage}
    />
  );
};

export default MyRequestList;

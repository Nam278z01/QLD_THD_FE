import useQuery from "../../../../Hook/useQuery";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getAllBadgeWithPage } from "../../../../services/BadgeAPI";
import Loading from "../../../sharedPage/pages/Loading";
import ManageBadeTable from "../../components/table/ManageBadgeTable";

export default function ManageBadgePage() {
  const query = useQuery();

  const pageQuery = query.get("page");
  const rowQuery = query.get("row") || 20;

  const [badgeData, setRefresh] = useRefreshToken(
    getAllBadgeWithPage,
    pageQuery,
    rowQuery
  );

  return badgeData === null ? (
    <Loading />
  ) : (
    <ManageBadeTable
      badgeData={badgeData.badges}
      totalPage={badgeData.totalPage}
      setRefresh={setRefresh}
    />
  );
}

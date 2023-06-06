import { useParams } from "react-router-dom";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getAllBadgeActive } from "../../../../services/BadgeAPI";
import { getRuleDetail, getRuleFsu } from "../../../../services/RuleAPI";
import Loading from "../../../sharedPage/pages/Loading";
import UpdateRuleValidation from "../../components/Forms/UpdateRuleValidation";

export default function UpdateRule() {
  const { id } = useParams();

  const [data, setRefreshdataRule] = useRefreshToken(getRuleDetail, id);
  const [RuleFsu] = useRefreshToken(getRuleFsu);

  return data === null || RuleFsu === null ? (
    <Loading />
  ) : (
    <UpdateRuleValidation data={data} ID={id} RuleFsu={RuleFsu} />
  );
}

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getAllActiveRule } from "../../../../services/RuleAPI";
import { getAllUserMasterNoPage } from "../../../../services/UsermasterAPI";
import { getAllProject } from "../../../../services/ProjectAPI";
import { getRequestDetail } from "../../../../services/RequestAPI";

import Loading from "../../../sharedPage/pages/Loading";
import UpdatePointValidation from "../../components/Forms/UpdatePointValidation";

export default function RequestUpdate() {
  const { ID } = useParams();

  const { role } = useSelector((a) => a.UserSlice);

  const [data] = useRefreshToken(getRequestDetail, ID);

  const [BULUser] = useRefreshToken(getAllUserMasterNoPage, 2);
  const [ruleData] = useRefreshToken(getAllActiveRule, role);
  const [projectData] = useRefreshToken(getAllProject);
  return data === null || projectData === null || BULUser === null ? (
    <Loading />
  ) : (
    <UpdatePointValidation
      data={data}
      ruledefinitiondatas={ruleData}
      projectData={projectData.projectData}
      BULUser={BULUser}
    />
  );
}

import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getAllHead, getAllPM } from "../../../../services/UsermasterAPI";
import Loading from "../../../sharedPage/pages/Loading";
import UpdateProjectValidation from "../../components/Forms/UpdateProjectValidation ";
import { useParams } from "react-router-dom";
import { getProjectDetail } from "../../../../services/ProjectAPI";
function UpdateProjectPage() {
  const projectID = useParams().ID;

  const [PMDatas] = useRefreshToken(getAllPM);
  const [HeadDatas] = useRefreshToken(getAllHead);
  const [ProjectData] = useRefreshToken(getProjectDetail, projectID);
  return PMDatas === null ? (
    <Loading />
  ) : (
    <UpdateProjectValidation
      PMDatas={PMDatas}
      HeadDatas={HeadDatas}
      data={ProjectData}
    />
  );
}

export default UpdateProjectPage;

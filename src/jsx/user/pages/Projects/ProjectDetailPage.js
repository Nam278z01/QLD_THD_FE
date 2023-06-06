import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getProjectDetail } from "../../../../services/ProjectAPI";
import ProjectDetail from "../../components/Detail/ProjectDetail";
import { useParams } from "react-router-dom";
import Loading from "../../../sharedPage/pages/Loading";

const ProjectDetailPage = () => {
  const projectID = useParams().ID;

  const [data, setRefresh] = useRefreshToken(getProjectDetail, projectID);

  return data === null ? (
    <Loading />
  ) : (
    <ProjectDetail
      project={data.project}
      members={data.projectMember}
      PM={data.project.Manager}
      setRefresh={setRefresh}
    />
  );
};

export default ProjectDetailPage;

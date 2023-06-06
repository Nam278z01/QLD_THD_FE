import { getAllProject } from "../../../../services/ProjectAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import NewCampaignValidation from "../../components/Forms/NewCampaignValidation";
import Loading from "../../../sharedPage/pages/Loading";

const CreateCampaign = () => {
  const [project] = useRefreshToken(getAllProject);

  return project === null ? (
    <Loading />
  ) : (
    <NewCampaignValidation project={project.projectData} />
  );
};

export default CreateCampaign;

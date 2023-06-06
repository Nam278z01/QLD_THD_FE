import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getAllHead, getAllPM } from "../../../../services/UsermasterAPI";
import Loading from "../../../sharedPage/pages/Loading";
import NewProjectValidation from "../../components/Forms/NewProjectValidation";

function NewProjectPage() {
  const [PMDatas] = useRefreshToken(getAllPM);
  const [HeadDatas] = useRefreshToken(getAllHead);

  return PMDatas === null ? (
    <Loading />
  ) : (
    <NewProjectValidation PMDatas={PMDatas} HeadDatas={HeadDatas} />
  );
}

export default NewProjectPage;

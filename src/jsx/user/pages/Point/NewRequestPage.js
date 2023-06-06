import { useSelector } from "react-redux";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getAllActiveRule } from "../../../../services/RuleAPI";
import {
  getAllUserMasterNoPage,
  getOneUserMasterByAccount,
} from "../../../../services/UsermasterAPI";
import { getAllUserProject } from "../../../../services/ProjectAPI";

import NewPointValidation from "../../components/Forms/NewPointValidation";
import Loading from "../../../sharedPage/pages/Loading";
import { array } from "yup/lib/locale";
import { getUserGroupChildRequest } from "../../../../services/GroupChildAPI";

const NewRequestPage = () => {
  const { account, role, userDepartmentCode } = useSelector(
    (state) => state.UserSlice
  );

  const { DefaultHead } = useSelector((a) => a.DepartmentSettingSlice);

  const [BULUser] = useRefreshToken(getAllUserMasterNoPage, 2);
  const [ruleData, setRefresh] = useRefreshToken(getAllActiveRule, role);
  const [projectData] = useRefreshToken(getAllUserProject, userDepartmentCode);
  const [userInfo] = useRefreshToken(getOneUserMasterByAccount, account);
  const DefaultHeadData = BULUser?.filter((data) => {
    return data.ID === DefaultHead;
  });
  const [subDepartment] = useRefreshToken(
    getUserGroupChildRequest,
    userInfo !== null && userInfo.Group !== "" ? userInfo.Group : " "
  );
  const approveList =
    userInfo !== null &&
    subDepartment !== null &&
    subDepartment !== undefined &&
    subDepartment.total !== 0
      ? subDepartment.groupchild &&
        [
          {
            ID: DefaultHead.UserMaster.ID,
            Account: DefaultHead.UserMaster.Account,
            label: DefaultHead.UserMaster.Account,
            RoleID: 2,
          },
        ].concat(
          subDepartment.groupchild.map((i) => ({
            ID: i.UserMasterID,
            Account: i.Account,
            label: i.Account,
            RoleID: 2,
          }))
        )
      : [
          {
            ID: DefaultHead.UserMaster.ID,
            Account: DefaultHead.UserMaster.Account,
            label: DefaultHead.UserMaster.Account,
            RoleID: 2,
          },
        ];

  return ruleData === null ||
    projectData === null ||
    DefaultHead === null ||
    subDepartment === null ||
    DefaultHeadData === undefined ? (
    <Loading />
  ) : (
    <NewPointValidation
      BULUser={userDepartmentCode === "FHN" ? approveList : BULUser}
      ruledefinitiondatas={ruleData}
      projectdatas={projectData}
      setRefresh={setRefresh}
      DefaultHeadData={DefaultHeadData[0]}
    />
  );
};

export default NewRequestPage;

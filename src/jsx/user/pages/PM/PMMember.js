import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import useQuery from "../../../../Hook/useQuery";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import {
  getAllProject,
  getProjectMember,
  syncProjectMember,
} from "../../../../services/ProjectAPI";

import useReplaceURL from "../../../../Hook/useReplaceURL";
import { Button } from "react-bootstrap";
import { useMsal } from "@azure/msal-react";
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { scopes } from "../../../../dataConfig";
import MemberListTable from "../../components/table/MemberListTable";
import Select from "react-select";
import Loading from "../../../sharedPage/pages/Loading";
import Swal from "sweetalert2";
import { GetTokenContext } from "../../../../context/GetTokenContext";

const PMMember = () => {
  const { instance, inProgress, accounts } = useMsal();
  const [loading, setLoading] = useState(false);
  const [whatProject, setWhatProject] = useState(999999);
  const [renderProjectName, setRenderProjectName] = useState("");

  const { getToken } = useContext(GetTokenContext);

  const query = useQuery();
  const searchQuery = query.get("search");
  const sortQuery = query.get("sort");
  const pageQuery = query.get("page") || 1;
  const rowQuery = query.get("row") || 10;

  const { account, userID, role } = useSelector((state) => state.UserSlice);
  const { Name, Code } = useSelector((state) => state.DepartmentSettingSlice);

  const { URLchange } = useReplaceURL(`/PM/member-list`);

  function pageChange(page) {
    URLchange(page, rowQuery, sortQuery, searchQuery);
  }

  const [data, setRefresh] = useRefreshToken(
    getProjectMember,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    whatProject
  );

  function syncWithJira() {
    setLoading(true);

    const success = () => {
      setLoading(false);
      setRefresh(new Date());
    };

    const fail = () => {
      setLoading(false);
    };

    getToken(
      syncProjectMember,
      "Sync success",
      success,
      fail,
      renderProjectName,
      new Date(),
      new Date()
    );
  }

  const [projectData] = useRefreshToken(
    getAllProject,
    "",
    "",
    "",
    "",
    account,
    "On-going",
    userID,
    role,
    Code.split(".").join(" ")
  );

  const customHead =
    projectData === null ? (
      ""
    ) : (
      //  chỗ này select project của  PM

      // <div className="w-100 d-flex justify-content-end">
      //   <div className="col-6">
      //     <div className="row justify-content-end">
      //       <Select
      //         options={projectData.projectData}
      //         defaultValue={projectData.projectData[0]}
      //         onChange={(project) => {
      //           pageChange(1);
      //           setWhatProject(project.projectID);
      //           setRenderProjectName(project.key);
      //         }}
      //         getOptionValue={(option) => option.projectID}
      //         className="col-6"
      //       />
      //       {/* <Button
      //         onClick={(e) => {
      //           syncWithJira();
      //           e.target.blur();
      //         }}
      //         variant="primary"
      //         className="col-2"
      //       >
      //         Sync Jira
      //       </Button> */}
      //     </div>
      //   </div>
      // </div>
      <></>
    );

  return data === null || projectData === null || loading ? (
    <Loading />
  ) : (
    <MemberListTable
      currentSearch={searchQuery}
      title="Member"
      datas={data.member}
      thead={[
        { Title: " ", Atribute: "", sort: false },
        { Title: "Name", Atribute: "DisplayName", sort: false },
        { Title: "Email", Atribute: "Email", sort: false },
        { Title: "Job Title", Atribute: "", sort: false },
        { Title: "Phone Number", Atribute: "PhoneNumber", sort: false },
        { Title: "YOB", Atribute: "YOB", sort: false },
      ]}
      totalPage={data.totalPage}
      totalItems={data.totalItems}
      projectData={projectData.projectData}
      setProject={setWhatProject}
      middleExtra={customHead}
    />
  );
};

export default PMMember;

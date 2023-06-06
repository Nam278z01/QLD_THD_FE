import ProjectTable from "../../components/table/ProjectTable";
import useQuery from "../../../../Hook/useQuery";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { useSelector } from "react-redux";
import {
  syncAllproject,
  getAllProject,
  getAllProjectNoPage,
  getAllDepartmentFsu,
  getAllProjectFsu,
  getProjectExcel,
} from "../../../../services/ProjectAPI";
import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import useReplaceURL from "../../../../Hook/useReplaceURL";
import Loading from "../../../sharedPage/pages/Loading";
import ExportExcel from "../../components/Shared/ExportExcel";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import ImportProjectMember from "../../components/modal/ImportProjectMemberExcel";
import { getMemberTemp, getProjectTemp } from "../../../../services/ExportAPI";
import moment from "moment";
import SynProjectModal from "../../components/modal/SynProjectModal";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getAllDepartmentGroupChild } from "../../../../services/GroupChildAPI";
import ImportProject from "../../components/modal/ImportProjectExcel ";
import LoadingModal from "../../components/modal/LoadingModal";

const ProjectListALL = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalProject, setShowModalProject] = useState(false);

  const [showModalLoading, setShowModalLoading] = useState(false);
  const { DepartmentID, IsFsu } = useSelector((a) => a.DepartmentSettingSlice);
  const [filterData, setFilterData] = useState([]);
  const { role, account, userID, userDepartmentCode } = useSelector(
    (state) => state.UserSlice
  );
  const { getTokenDownload } = useContext(GetTokenContext);
  const [projectExport, setRefreshProjectExport] =
    useRefreshToken(getAllProjectNoPage);

  const query = useQuery();
  const searchQuery = query.get("search");
  const sortQuery = query.get("sort");
  const pageQuery = query.get("page") || 1;
  const rowQuery = query.get("row") || 10;
  const statusQuery = query.get("status");
  const [pageURL, setPageURL] = useState("");
  useEffect(() => {
    setPageURL(window.location.pathname);
  });
  let [data, setRefresh] = useRefreshToken(
    getAllProject,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    account,
    statusQuery,
    userID,
    role,
    userDepartmentCode
  );
  let [dataexport, setRefreshdataexport] = useRefreshToken(
    getProjectExcel,
    searchQuery
  );
  let [fullData, setRefreshh] = useRefreshToken(
    getAllProject,
    rowQuery,
    userDepartmentCode
  );
  const [dataf, setRefreshf] = useRefreshToken(
    getAllProjectFsu,
    pageQuery,
    rowQuery,
    sortQuery,
    searchQuery,
    account,
    statusQuery,
    userID,
    role,
    userDepartmentCode
  );
  const [datafsu, setRefreshfsu] = useRefreshToken(getAllDepartmentFsu);
  const [groupChildListFsu, setGroupChildListFsu] = useRefreshToken(
    getAllDepartmentGroupChild,
    DepartmentID
  );

  const { getToken } = useContext(GetTokenContext);

  const navigate = useHistory();
  const [show, setShow] = useState(false);
  const syncProject = () => {
    setLoading(true);

    function success() {
      setLoading(false);
      setRefresh(new Date());
      setRefreshProjectExport(new Date());
    }

    getToken(syncAllproject, "Sync success", success, () => {
      setLoading(false);
    });
  };
  const syncProjectFsu = () => {
    setLoading(true);

    function success() {
      setLoading(false);
      setRefresh(new Date());
      setRefreshProjectExport(new Date());
    }

    getToken(syncAllproject, "Sync success", success, () => {
      setLoading(false);
    });
  };

  const { URLchange } = useReplaceURL("project-list");

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
  function filterHandle(filter) {
    URLchange(1, rowQuery, sortQuery, searchQuery, null, null, filter);
  }

  const thead = [
    {
      Title: "Project Code",
      Atribute: "",
      sort: false,
      className: "text-center",
    },

    {
      Title: "Manager",
      Atribute: "",
      sort: false,
      className: "text-center",
    },

    { Title: "Department", Atribute: "", sort: false },

    {
      Title: "Start Date",
      Atribute: "",
      sort: false,
    },
    {
      Title: "End Date",
      Atribute: "",
      sort: false,
    },

    {
      Title: "Status",
      Atribute: "",
      sort: false,
      className: "text-center",
    },
  ];

  return loading ||
    dataexport === null ||
    data === null ||
    projectExport === null ||
    groupChildListFsu === null ||
    fullData === null ||
    dataf === null ? (
    <Loading />
  ) : (
    <>
      <LoadingModal show={showModalLoading} />

      <SynProjectModal
        show={show}
        setShow={setShow}
        datafsu={groupChildListFsu}
        setRefreshfsu={setRefreshfsu}
        setRefreshf={setRefreshf}
      />
      {IsFsu === 1 ? (
        <ProjectTable
          currentSearch={searchQuery}
          datas={dataf.projectData}
          status={false}
          thead={thead}
          totalPage={dataf.totalPage}
          totalItems={data.totalItems}
          type={role}
          middleExtra={
            role === "Head" && (
              <div className="d-flex justify-content-end mt-1 gap-2">
                <div>
                  {/* <Button
                    onClick={(e) => {
                      e.target.blur();
                      getTokenDownload(
                        getMemberTemp,
                        `MEMBER-PROJECT-TEMPLATE(${moment(new Date()).format(
                          "DD-MM-YYYY"
                        )})`
                      );
                    }}
                  >
                    Template Member <i className="fas fa-file-arrow-down"></i>
                  </Button> */}
                </div>
                {/* <div>
                  <ImportProjectMember
                    show={showModal}
                    setShowModal={setShowModal}
                    setRefresh={setRefresh}
                    setShowModalLoading={setShowModalLoading}
                  />
                  <Button
                    onClick={(e) => {
                      setShowModal(true);
                      e.target.blur();
                    }}
                  >
                    Import Member <i className="fas fa-file-import" />
                  </Button>
                </div> */}
                <div>
                  {/* <Button
                    onClick={(e) => {
                      e.target.blur();
                      navigate.push("/Head/create-project");
                    }}
                  >
                    New Project <i className="fas fa-plus" />
                  </Button> */}
                </div>
                <div>
                  {" "}
                  {/* <Button
                    onClick={(e) => {
                      e.target.blur();
                      getTokenDownload(
                        getProjectTemp,
                        `PROJECT-TEMPLATE(${moment(new Date()).format(
                          "DD-MM-YYYY"
                        )})`
                      );
                    }}
                  >
                    Template Project <i className="fas fa-file-arrow-down"></i>
                  </Button> */}
                </div>

                {/* {IsFsu === 1 ? (
                  <div>
                    <Button
                      onClick={(e) => {
                        setShow(true);
                        // syncProject(e);

                        e.target.blur();
                      }}
                      title="Sync From Jira "
                    >
                      Sync <i className="fas fa-rotate" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      onClick={(e) => {
                        syncProject(e);

                        // setShow(true);
                        e.target.blur();
                      }}
                      title="Sync From Jira "
                    >
                      Sync <i className="fas fa-rotate" />
                    </Button>
                  </div>
                )}{" "} */}
                <ExportExcel
                  projectdatas={
                    dataexport.projectData !== null
                      ? dataexport.projectData
                      : []
                  }
                  element={"Export"}
                  exportName="Project List"
                />
                <div>
                  <ImportProject
                    show={showModalProject}
                    setShowModal={setShowModalProject}
                    setRefresh={setRefresh}
                    setShowModalLoading={setShowModalLoading}
                    setRefreshdataexport={setRefreshdataexport}
                  />
                  <Button
                    onClick={(e) => {
                      setShowModalProject(true);
                      e.target.blur();
                    }}
                  >
                    Import <i className="fas fa-file-import" />
                  </Button>
                </div>
              </div>
            )
          }
          pageChange={pageChange}
          rowChange={rowChange}
          sortHandle={sortHandle}
          searchHandle={searchHandle}
          filterHandle={filterHandle}
        />
      ) : (
        <ProjectTable
          currentSearch={searchQuery}
          datas={data.projectData}
          status={false}
          thead={thead}
          totalPage={data.totalPage}
          totalItems={data.totalItems}
          type={role}
          middleExtra={
            role === "Head" && (
              <div className="d-flex justify-content-end mt-1 gap-2">
                {/* <div>
                  <Button
                    onClick={(e) => {
                      e.target.blur();
                      getTokenDownload(
                        getMemberTemp,
                        `MEMBER-PROJECT-TEMPLATE(${moment(new Date()).format(
                          "DD-MM-YYYY"
                        )})`
                      );
                    }}
                  >
                    Template Member <i className="fas fa-file-arrow-down"></i>
                  </Button>
                </div> */}
                {/* <div>
                  <ImportProjectMember
                    show={showModal}
                    setShowModal={setShowModal}
                    setRefresh={setRefresh}
                    setShowModalLoading={setShowModalLoading}
                  />
                  <Button
                    onClick={(e) => {
                      setShowModal(true);
                      e.target.blur();
                    }}
                  >
                    Import Member <i class="fas fa-file-import" />
                  </Button>
                </div> */}
                <div>
                  {/* <Button
                    onClick={(e) => {
                      e.target.blur();
                      getTokenDownload(
                        getProjectTemp,
                        `PROJECT-TEMPLATE(${moment(new Date()).format(
                          "DD-MM-YYYY"
                        )})`
                      );
                    }}
                  >
                    Template Project <i className="fas fa-file-arrow-down"></i>
                  </Button> */}
                  {/* <Button
                    onClick={(e) => {
                      e.target.blur();
                      navigate.push("/Head/create-project");
                    }}
                  >
                    New Project <i className="fas fa-plus" />
                  </Button> */}
                </div>

                {/* {IsFsu === 1 ? (
                  <div>
                    <Button
                      onClick={(e) => {
                        setShow(true);
                        // syncProject(e);

                        e.target.blur();
                      }}
                      title="Sync From Jira "
                    >
                      Sync <i className="fas fa-rotate" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      onClick={(e) => {
                        syncProject(e);

                        // setShow(true);
                        e.target.blur();
                      }}
                      title="Sync From Jira "
                    >
                      Sync <i className="fas fa-rotate " />
                    </Button>
                  </div>
                )}{" "} */}
                <ExportExcel
                  projectdatas={
                    dataexport.projectData !== null
                      ? dataexport.projectData
                      : []
                  }
                  element={"Export"}
                  exportName="Project List"
                />
                <div>
                  <ImportProject
                    show={showModalProject}
                    setShowModal={setShowModalProject}
                    setRefresh={setRefresh}
                    setShowModalLoading={setShowModalLoading}
                    setRefreshdataexport={setRefreshdataexport}
                  />
                  <Button
                    onClick={(e) => {
                      setShowModalProject(true);
                      e.target.blur();
                    }}
                  >
                    Import <i className="fas fa-file-import" />
                  </Button>
                </div>
              </div>
            )
          }
          pageChange={pageChange}
          rowChange={rowChange}
          sortHandle={sortHandle}
          searchHandle={searchHandle}
          filterHandle={filterHandle}
        />
      )}
    </>
  );
};
export default ProjectListALL;

import { useEffect, useState, useContext, useCallback, useRef } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import {
  createCampaign,
  updateCampaign,
} from "../../../../services/CampaignAPI";
import Select from "react-select";
import { getOneUserMaster } from "../../../../services/UsermasterAPI";
import { getAllProjectNoPage } from "../../../../services/ProjectAPI";
import { getProjectDetail } from "../../../../services/ProjectAPI";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getOneDepartmentDetail } from "../../../../services/DepartmentAPI";
import { Autocomplete, TextField } from "@mui/material";
import { getAllMem } from "../../../../services/UsermasterAPI";
import { getAllActiveMem } from "../../../../services/UsermasterAPI";
const BasicInfo = ({ basicDatas }) => {
  const [department] = useRefreshToken(
    getOneDepartmentDetail,
    basicDatas.DepartmentID
  );
  const { role, userID } = useSelector((state) => state.UserSlice);
  const { getToken } = useContext(GetTokenContext);
  const [data, setData] = useState(basicDatas);
  const [confirmPerson, setConfirmPerson] = useState(basicDatas.Confirmer);
  const [Project, setProject] = useState(basicDatas.Project);
  const [originalData, setOriginalData] = useState(data);
  const [first, setFirst] = useState(true);
  const[submitEdit,setSubmitEdit] = useState(false);
  const[currentProject,setCurrentProject] = useState("");
  const[currentBudget,setCurrentBudget] = useState(basicDatas.Budget);
  const navigate = useHistory();
  const id = useParams().ID;
  const ID = parseInt(basicDatas.ID);
  const [allMemberList, setRefresh, setAllMemberList] =
    useRefreshToken(getAllActiveMem);
  const [allProject, getAllProject] = useRefreshToken(getAllProjectNoPage);
  const [userMaster] = useRefreshToken(getOneUserMaster,userID);
  const [edit, setEdit] = useState(false || ID == 0);
  const [departmentName, setDepartmentName] = useState("");
  useEffect(() => {
    if (department !== null) setDepartmentName(department.Code);
  }, [department]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  // const [newCampaign, setNewCampaign] = useState(null);
  function checkValidConfirmer(){
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (document.getElementById("group-search-bar").value === "") {
      document.getElementById("alertConfirmer").innerHTML = "This field is required";
    }
    else document.getElementById("alertConfirmer").innerHTML = "";

    if(document.getElementById("Name").value.trim()=="")
    {
      document.getElementById("alertName").innerHTML = "This field is required";
    }
    else if (format.test(document.getElementById("Name").value)) {
      document.getElementById("alertName").innerHTML = "Please enter only alphanumeric characters";
    }
    else {
      document.getElementById("alertName").innerHTML = ""
    };
    
  };

  const setBasicData = () => {
    if (!first) {
      
      setData({
        ID: data.ID,
        DepartmentID: data.DepartmentID,
        ProjectID: data.ProjectID,
        Name: document.getElementById("Name").value,
        Description: document.getElementById("Description").value,
        StartDate: document.getElementById("StartDate").value,
        EndDate: document.getElementById("EndDate").value,
        Deadline: document.getElementById("Deadline").value,
        Budget:document.getElementById("Budget").value,
        MaximumReceiver: document.getElementById("MaxReceiver").value,
        CoinNumber: document.getElementById("CoinNumber").value,
        Confirmer: confirmPerson,
        ProjectID:
          Project !== null && Project !== undefined ? Project.ID : null,
      });
    }

    setEdit(false);
  };
  useEffect(() => {
    if (document.getElementById("StartDate") !== null) {
      var IsDate = new Date(document.getElementById("StartDate").value);
      IsDate.setDate(IsDate.getDate() + 1);
      document.getElementById("StartDate").min = new Date()
        .toISOString()
        .split("T")[0];
      if (document.getElementById("EndDate") !== null) {
        if (IsDate !== null) {
          document.getElementById("EndDate").min =
            IsDate.toISOString().substring(0, 10);
          if (
            document.getElementById("EndDate").value <
            document.getElementById("StartDate").value
          )
            document.getElementById("EndDate").value =
              IsDate.toISOString().substring(0, 10);

          document.getElementById("Deadline").min =
            document.getElementById("StartDate").value + "T00:00";
          document.getElementById("Deadline").max =
            document.getElementById("EndDate").value + "T12:00";
          if (
            document.getElementById("Deadline").value.substring(0, 10) >
              document.getElementById("EndDate").value ||
            document.getElementById("Deadline").value.substring(0, 10) <
              document.getElementById("StartDate").value
          )
            document.getElementById("Deadline").value =
              document.getElementById("StartDate").value +
              document.getElementById("Deadline").value.substring(10);
        }
      }
    }
  }, [startDate, endDate]);
  useEffect(() => {
   
        if (basicDatas.Project !== null && basicDatas.Project !== undefined)
        setCurrentProject(basicDatas.Project.Key);
  }, []);

  useEffect(() => {
    if(edit===true){
      document
      .getElementById("projectDisplay")
      .style.border = "none";

      document
      .getElementById("confirmerDisplay")
      .style.border = "none";
    }
    else{
      document
      .getElementById("projectDisplay")
      .style.border = "groove";

      document
      .getElementById("confirmerDisplay")
      .style.border = "groove";
    }
      
  }, [edit]);
  const changeConfirmPerson = (newConfirmPerson) => {
    setConfirmPerson(newConfirmPerson.Account);
  };
  const changeProject = (newProject) => {
    setProject(newProject);
  };
  useEffect(() => {
    if (!first && !(data === originalData)&&submitEdit) {
      sendCampaign();
      setSubmitEdit(false);
    } else {
      setFirst(false);
    }
  }, [data]);

  const discardChange = () => {
    setEdit(false);
    window.location.reload();
  };

  function sendCampaign() {
    function success() {
      navigate.replace(`/campaign-list`);
    }

    function success2() {
      navigate.replace(`/campaign-list`);
    }
    if (ID != 0) {
      getToken(
        updateCampaign,
        "Campaign has been updated",
        success,
        false,
        ID,
        data
      );
    } else if (ID === 0) {
      getToken(
        createCampaign,
        "New campaign has been create",
        success2,
        false,
        data
      );
      // console.log("newcampaign basic info", newCampaign);
    }
  }

  // useEffect( () => {
  //   console.log("useEffect newCampaign: ", newCampaign);
  //   if (newCampaign !== null){
  //     navigate.replace(`/campaign-detail/` + newCampaign.data.ID);
  //   }
  // },[newCampaign])

  return (
    <form
      id="myForm2"
      onSubmit={(e) => {
        e.preventDefault();
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if (document.getElementById("group-search-bar").value === ""||document.getElementById("group-search-bar").value === ""||format.test(document.getElementById("Name").value)) {
        } else setBasicData();
      }}
    >
      <div className="row m-4">
        <div className="col col-6">
          <div className="">
            <span className="text-primary">Campaign Name<span style={{color:"red"}}>*</span>: </span>
            <div className="col-11 d-flex flex-row rounded border p-2">
              <input
                id="Name"
                name="Name"
                maxLength={255}
                type="text"
                required
                className="col-12 border-0"
                defaultValue={data.Name}
                readOnly={!edit}
              ></input>
              
          </div>
          <div id="alertName" style={
                      {color:"red"}}></div>
                  
            </div>
          <div className="">
            <span className="text-primary">Description:</span>
            <div
              className="col-11 d-flex flex-row rounded border p-2"
              style={{ minHeight: 150 }}
            >
              <textarea
                id="Description"
                name="Description"
                type="text"
                maxLength={5000}
                className="col-12 border-0"
                defaultValue={data.Description}
                readOnly={!edit}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="col col-6">
         

          <>
            <div className="" >
              <span className="text-primary">Budget<span style={{color:"red"}}>*</span>: </span>
              <div className="col-11 d-flex flex-row rounded border p-2">
                <input
                  id="Budget"
                  name="Budget"
                  type="number"
                  min={0}
                  required
                  onChange={(e)=>{setCurrentBudget(e.target.value);}}
                  max={userMaster!==null?userMaster.TotalCoin:0}
                  pattern="[0-9]{1,}"
                  className="col-12 border-0"
                  defaultValue={data.Budget}
                  readOnly={!edit}
                ></input>
              </div>
            </div>
            <span className="text-primary">Max Receiver<span style={{color:"red"}}>*</span>: </span>
            <div className="col-11 d-flex flex-row rounded border p-2">
              <input
                id="MaxReceiver"
                name="MaxReceiver"
                type="number"
                min={0}
                max={document.getElementById('Budget')!==null&&(document.getElementById('Budget').value)}
                required
                pattern="[0-9]{1,}"
                className="col-12 border-0"
                defaultValue={data.MaximumReceiver}
                readOnly={!edit}
              ></input>
            </div>

            <span className="text-primary">Coin Number<span style={{color:"red"}}>*</span>: </span>
            <div className="col-11 d-flex flex-row rounded border p-2">
              <input
                id="CoinNumber"
                name="CoinNumber"
                type="number"
                min={0}
                max={currentBudget}
                required
                pattern="[0-9]{1,}"
                className="col-12 border-0"
                defaultValue={data.CoinNumber}
                readOnly={!edit}
              ></input>
            </div>
          </>
        </div>

        <div className="col">
          <div className="row">
            <div className="col col-6">
              <span className="text-primary">Start Date<span style={{color:"red"}}>*</span>: </span>
              <br></br>
              <input
                id="StartDate"
                name="StartDate"
                type="date"
                className=" rounded border col-10 p-2"
                defaultValue={data.StartDate.substring(0, 10)}
                readOnly={(basicDatas.MoocCampaigns.length == 0 ? !edit : true)}
                onChange={(event) => {
                  setStartDate(event.target.value);
                }}
              ></input>
            </div>
            <div className="col-6">
              <span className="text-primary">End Date<span style={{color:"red"}}>*</span>: </span>
              <br></br>
              <input
                type="date"
                id="EndDate"
                name="EndDate"
                onChange={(event) => {
                  setEndDate(event.target.value);
                }}
                className=" rounded border col-10 p-2"
                defaultValue={data.EndDate.substring(0, 10)}
                readOnly={!edit}
              ></input>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <span className="text-primary">Deadline<span style={{color:"red"}}>*</span>: </span>
              <br></br>
              <input
                type="datetime-local"
                id="Deadline"
                name="Deadline"
                style={{color:"black"}}
                className=" rounded border col-10 p-2"
                defaultValue={data.Deadline.substring(0, 16)}
                readOnly={!edit}
                onChange={(e) => {}}
              ></input>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-3">
                  <span className="text-primary">Confirmed By<span style={{color:"red"}}>*</span>: </span>
                </div>
                <div className="col-9"></div>
                <div id="confirmerDisplay" className={"col-10 d-flex flex-row rounded mx-2"+(!edit?" border p-2":"")}>
                  <input
                    id="confirmPerson"
                    name="confirmPerson"
                    type="text"
                    className="col-12 border-0"
                    value={confirmPerson}
                    hidden={edit}
                    readOnly={!edit}
                  ></input>
                  
                </div>
              </div>
              <div className="col-12 border-0 ">
                {/* {console.log("memList: ", allMemberList)} */}
                    <Autocomplete
                      hidden={!edit}
                      className="col-12 "
                      value={confirmPerson}
                      onChange={(event, newValue) => {
                        if (newValue) changeConfirmPerson(newValue);
                      }}
                      required
                      id="group-search-bar"
                      freeSolo
                      
                      getOptionLabel={(option) => {
                        if (typeof option === "string") {
                          return option;
                        }
                        return option.Account;
                      }}
                      options={allMemberList}
                      renderOption={(props, option) => (
                        <li key={option.Account} {...props}>{option.Account}</li>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} label="Choose Confirmer:" />
                      )}
                    />
                    <div id="alertConfirmer" style={
                      {color:"red"}}></div>
                  </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-3">
                  <span className="text-primary">Project: </span>
                </div>
                <div id="projectDisplay"  className={"col-10 d-flex flex-row rounded mx-2"+(!edit?" border p-2":"")}>
                  <input
                    id="confirmProject"
                    name="confirmProject"
                    type="text"
                    className="col-12 border-0"
                    value={
                      Project !== null && Project !== undefined
                        ? Project.Key
                        : ""
                    }
                    hidden={edit}
                    readOnly={!edit}
                  ></input>
                  
                </div>
              </div>
              <div className="col-12 border-0 ">
                    <Autocomplete
                      hidden={!edit}
                      className="col-12 border-danger"
                      value={
                        Project !== null && Project !== undefined
                          ? Project.Key
                          : ""
                      }
                      onChange={(event, newValue) => {
                        if (newValue) changeProject(newValue);
                        if (newValue === null) {
                          changeProject(undefined);
                          
                        } else{
                          
                          setCurrentProject(newValue.Key);
                        }
                         
                      }}
                      id="project-search-bar"
                      freeSolo
                      getOptionLabel={(option) => {
                        if (typeof option === "string") {
                          return option;
                        }
                        return option.Key;
                      }}
                      options={allProject}
                      renderOption={(props, option) => (
                        <li {...props}>{option.Key}</li>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} label="Choose Project:" />
                      )}
                    />
                  </div>
            </div>
            <div className="col-12">
              <div className="row m-4 align-items-center">
                <div className="">
                  <button
                    className="mx-4 py-2 px-4 bg-primary text-white border-0 rounded"
                    hidden={edit || role !== "Head"}
                    type="button"
                    onClick={() => {
                      setEdit(true);
                    }}
                  >
                    <h6 className="text-white">Edit</h6>
                  </button>
                </div>
                <div className="col">
                  <button
                    className="mx-4 py-2 px-4 bg-primary text-white border-0 rounded"
                    hidden={!edit || role !== "Head" || ID === 0}
                    onClick={() => {
                      setSubmitEdit(false);
                      discardChange();
                      
                    }}
                  >
                    <h6 className="text-white">Cancel</h6>
                  </button>
                </div>
                <div className="col">
                  <button
                    className="mx-4 py-2 px-4 bg-primary text-white border-0 rounded"
                    hidden={!edit || role !== "Head"}
                    onClick={() => {
                      
                      checkValidConfirmer();
                      setSubmitEdit(true);
                    }}
                    type="submit"
                  >
                    <h6 className="text-white">Save And Go Back</h6>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
export default BasicInfo;

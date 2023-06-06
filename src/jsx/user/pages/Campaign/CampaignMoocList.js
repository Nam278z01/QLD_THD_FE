import { useEffect, useState, useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import {
  createCampaign,
  updateCampaign,
  updateCampaignGroupList,
  updateCampaignMoocsList,
} from "../../../../services/CampaignAPI";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box } from "@mui/system";
import { Button } from "react-bootstrap";

const CampaignMoocList = ({ datas }) => {
  const { role } = useSelector((state) => state.UserSlice);
  const [data, setData] = useState(datas);
  const [moocs, setMoocs] = useState(data.MoocCampaigns);
  const navigate = useHistory();
  const id = useParams().ID;
  const ID = parseInt(datas.ID);
  const { getToken } = useContext(GetTokenContext);
  const [originalMoocs, setOriginalMoocs] = useState(moocs);
  const [edit, setEdit] = useState(false);
  const [edit2, setEdit2] = useState(false);
  const [curEditMooc, setCurEditMooc] = useState(-1);
  // const [curEditMoocBudget, setCurEditMoocBudget] = useState(0);
  // const [curEditMoocCoinNumber, setCurEditMoocCoinNumber] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [curMooc, setCurMooc] = useState({
    StartDate: data.StartDate,
    EndDate: data.EndDate,
    Budget: data.Budget,
    CoinNumber: 0,
  });
  const [first, setFirst] = useState(true);
  const moocList = [];
  const discardChange = () => {
    setMoocs(originalMoocs);
    setEdit(false);
    setEdit2(false);
    setShowAdd(false);
  };
  
  const displayCurMooc = () => {
    if (edit) setShowAdd(true);
  };
  const removeLastMooc = () => {
    if (edit) {
      setMoocs(moocs.slice(0, moocs.length - 1));
    }
  };

  const addMooc = () => {
    if (showAdd) {
      setMoocs([
        ...moocs,
        {
          StartDate: document.getElementById("cur-mooc-start-date").value,
          EndDate: document.getElementById("cur-mooc-end-date").value,
          Budget: +document.getElementById("cur-mooc-budget").value,
          CoinNumber: +document.getElementById("cur-mooc-coin-number").value,
        },
      ]);
      setShowAdd(false);
    }
  };

  const commitCurEditMooc = (i) => {

    if (edit) {
      setMoocs([
        ...i === 0 ? [] : moocs.slice(0,i),
        {
          StartDate: moocs[i].StartDate,
          EndDate: moocs[i].EndDate,
          Budget: +document.getElementById("mooc-budget-"+i).value,
          CoinNumber: +document.getElementById("mooc-coin-number-"+i).value,
        },
        ...i === moocs.length ? [] : moocs.slice(i + 1, moocs.length),
      ]);
    }
  }

  useEffect(() => {
    let remainBudget = datas.Budget;
    if(remainBudget!==null){
      for (let index = 0; index < moocs.length; index++) {
        remainBudget = remainBudget - moocs[index].Budget;
        
      }
    }
    if (curEditMooc !== -1){
        var date2 = new Date(moocs[curEditMooc].StartDate);
        if (
          date2.toISOString().substring(0, 10) >= datas.Deadline.substring(0, 10)
        ) {
          document.getElementById("mooc-coin-number-"+curEditMooc).max = 0;
          document.getElementById("mooc-budget-"+curEditMooc).disabled = true;
        }
        else{  
          document.getElementById("mooc-budget-"+curEditMooc).max = remainBudget + moocs[curEditMooc].Budget;
          document.getElementById("mooc-coin-number-"+curEditMooc).max = document.getElementById("mooc-budget-"+curEditMooc).value;
        }
      }
  },[curEditMooc])

  useEffect(() => {
    let remainBudget = datas.Budget;
    if(remainBudget!==null){
      for (let index = 0; index < moocs.length; index++) {
        remainBudget = remainBudget - moocs[index].Budget;
        
      }
    }
    if (moocs.length > 0) {
      var date = new Date(moocs[moocs.length - 1].EndDate);
      date.setDate(date.getDate() + 1);
      if (date !== null) {
        if (
          date.toISOString().substring(0, 10) >= datas.EndDate.substring(0, 10)
        ) {
          document.getElementById("addNewMooc").hidden = true;
        } else document.getElementById("addNewMooc").hidden = false;
        if (
          date.toISOString().substring(0, 10) >= datas.Deadline.substring(0, 10)
        ) {
          document.getElementById("cur-mooc-coin-number").max = 0;
          document.getElementById("cur-mooc-coin-number").value = 0;
          document.getElementById("cur-mooc-budget").value = 0;
          document.getElementById("cur-mooc-budget").disabled = true;
        }
        else{
          
          document.getElementById("cur-mooc-budget").max = remainBudget;
          document.getElementById("cur-mooc-coin-number").max = datas.Budget;
          document.getElementById("cur-mooc-budget").disabled = false;
        }
        var endDate = new Date(moocs[moocs.length - 1].EndDate);
        endDate.setDate(endDate.getDate() + 2);
        document.getElementById("cur-mooc-end-date").value = endDate
          .toISOString()
          .substring(0, 10);
        document.getElementById("cur-mooc-end-date").min = endDate
          .toISOString()
          .substring(0, 10);
        document.getElementById("cur-mooc-end-date").max =
          datas.EndDate.substring(0, 10);
      }
      setCurMooc({
        StartDate: date.toISOString(),
        EndDate: date.toISOString(),
        Budget: curMooc.Budget,
        CoinNumber: curMooc.CoinNumber,
      });
    } else {
      document.getElementById("cur-mooc-coin-number").max = datas.Budget;
      document.getElementById("cur-mooc-budget").disabled = false;
      document.getElementById("cur-mooc-budget").max = datas.Budget;
      document.getElementById("cur-mooc-budget").value = 0;
      document.getElementById("addNewMooc").hidden = false;
      var IsDate = new Date(datas.StartDate.substring(0, 10));
      IsDate.setDate(IsDate.getDate() + 1);
      if (IsDate !== null) {
        document.getElementById("cur-mooc-end-date").value =
          IsDate.toISOString().substring(0, 10);
        document.getElementById("cur-mooc-end-date").min =
          IsDate.toISOString().substring(0, 10);
      }
      document.getElementById("cur-mooc-end-date").max =
        datas.EndDate.substring(0, 10);
      setCurMooc({
        StartDate: data.StartDate,
        EndDate: curMooc.EndDate,
        Budget: data.Budget,
        CoinNumber: 0,
      });
    }
  }, [moocs]);

  function sendCampaignMoocsList() {
    moocs.map((x) => {
      moocList.push({
        StartDate: x.StartDate,
        EndDate: x.EndDate,
        Budget: x.Budget,
        CoinNumber: x.CoinNumber,
      });
    });


    function success() {
      navigate.push(`/campaign-detail/${ID}`);
    }

    if (ID != 0) {
      getToken(
        updateCampaignMoocsList,
        "Campaign mooc list has been updated",
        success,
        false,
        ID,
        moocList
      );
    }
    setOriginalMoocs(moocs);
    setEdit(false);
  }

  return (
    <form
      id="myForm2"
      onSubmit={(e) => {
        e.preventDefault();
        addMooc();
      }}
    >
      <div>
        <hr
          hidden={
            ID == 0 || (role !== "Head" && data.MoocCampaigns.length === 0)
          }
        ></hr>
        <div
          className="row m-2 "
          style={{ minHeight: 100 }}
          hidden={
            ID == 0 || (role !== "Head" && data.MoocCampaigns.length === 0)
          }
        >
          <div>
            <div>
              <div className="row">
                <span
                  className="text-primary col-8"
                  hidden={!data.MoocCampaigns}
                >
                  Campaign Mooc:{" "}
                </span>
                <div className="col-2" hidden={!edit}>
                  <button
                    type="button"
                    className=" bg-primary text-white border-0 rounded col-10"
                    onClick={() => {
                      displayCurMooc();
                    }}
                    id="addNewMooc"
                  >
                    New Mooc
                  </button>
                </div>
                <div className="col-2" hidden={!edit}>
                  <button
                    type="button"
                    className=" bg-warning text-white border-0 rounded col-10"
                    onClick={() => {
                      removeLastMooc();
                    }}
                  >
                    Remove Last Mooc
                  </button>
                </div>
              </div>
            </div>
            <Box sx={{ width: "100%" }}>
              {moocs.map((x,i) => (
                <div className="row m-2" key={x.ID}>
                  <div className="col col-3">
                    <span className="text-primary ">Start Date: </span>
                    <br></br>
                    <input
                      type="date"
                      className=" rounded border col-10 p-2"
                      defaultValue={x.StartDate.substring(0, 10)}
                      readOnly={true}
                      // onChange={(e) => {}}
                    ></input>
                  </div>
                  <div className="col-3">
                    <span className="text-primary ">End Date: </span>
                    <br></br>
                    <input
                      type="date"
                      className=" rounded border col-10 p-2"
                      defaultValue={x.EndDate.substring(0, 10)}
                      readOnly={true}
                      // onChange={(e) => {

                      // }}
                    ></input>
                  </div>
                  <div className="col-2">
                    <span className="text-primary">Budget: </span>
                    <br></br>
                    <input
                      id={"mooc-budget-"+i}
                      type="number"
                      className=" rounded border col-11 p-2"
                      Value={x.Budget}
                      readOnly={!edit || !edit2 || curEditMooc != i}
                      onChange={(e) =>{
                        document.getElementById("mooc-coin-number-"+i).max = document.getElementById("mooc-budget-"+i).value;
                        if (+document.getElementById("mooc-budget-"+i).value > +document.getElementById("mooc-budget-"+i).max) {
                          // document.getElementById("mooc-budget-"+i).value = document.getElementById("mooc-budget-"+i).max;
                          document.getElementById("mooc-budget-"+i).value = null;
                          document.getElementById("mooc-budget-"+i).placeholder = "max: "+ (document.getElementById("mooc-budget-"+i).max);
                        }
                      }}
                    ></input>
                  </div>
                  <div className="col-2">
                    <span className="text-primary">Coin Number: </span>
                    <br></br>
                    <input
                      id={"mooc-coin-number-"+i}
                      type="number"
                      className=" rounded border col-11 p-2"
                      Value={x.CoinNumber}
                      readOnly={!edit || !edit2 || curEditMooc != i}
                      onChange={(e) =>{
                        if (+document.getElementById("mooc-coin-number-"+i).value > +document.getElementById("mooc-coin-number-"+i).max) {
                          // document.getElementById("mooc-coin-number-"+i).value = document.getElementById("mooc-coin-number-"+i).max;
                          document.getElementById("mooc-coin-number-"+i).value = null;
                          document.getElementById("mooc-coin-number-"+i).placeholder = "Must <= Budget";

                        }
                      }}
                    ></input>
                  </div>
                  <div className="col-1">
                    <span> </span>
                    <br></br>
                    <div className="row">
                      <Button 
                        className="col mx-2" 
                        hidden={!edit || edit2}
                        onClick={(e)=>{
                          setEdit2(true);
                          setCurEditMooc(i);
                        }}
                      >
                        Edit</Button>
                      <Button 
                        className="col mx-2" 
                        hidden={!edit || !edit2 || curEditMooc != i}
                        onClick={(e)=>{
                          setEdit2(false);
                          setCurEditMooc(-1);
                          commitCurEditMooc(i)
                        }}
                      >Save</Button>
                    </div>
                  </div>
                </div>
              ))}
              <br></br>

              <div className="row m-2" hidden={!showAdd || !edit}>
                <span className="text-danger">New Mooc Input</span>
                <div className="col col-3">
                  <span className="text-danger ">Start Date: </span>
                  <br></br>
                  <input
                    id="cur-mooc-start-date"
                    type="date"
                    className=" rounded border col-10 p-2"
                    value={curMooc.StartDate.substring(0, 10)}
                    readOnly={true}
                  ></input>
                </div>
                <div className="col-3">
                  <span className="text-danger ">End Date: </span>
                  <br></br>
                  <input
                    id="cur-mooc-end-date"
                    type="date"
                    className=" rounded border col-10 p-2"
                    readOnly={!showAdd}
                  ></input>
                </div>
                <div className="col-2">
                  <span className="text-danger">Budget: </span>
                  <br></br>
                  <input
                    id="cur-mooc-budget"
                    type="number"
                    max={datas.Budget}
                    className=" rounded border col-11 p-2"
                    defaultValue={curMooc.Budget}
                    readOnly={!showAdd}
                  ></input>
                </div>
                <div className="col-2">
                  <span className="text-danger">Coin Number: </span>
                  <br></br>
                  <input
                    id="cur-mooc-coin-number"
                    type="number"
                    className=" rounded border col-11 p-2"
                    defaultValue={curMooc.CoinNumber}
                    readOnly={!showAdd}
                  ></input>
                </div>
                <div className="col-1">
                  <br></br>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    hidden={!showAdd}
                    onClick={() => {
                      
                    }}
                  >
                    {"save "}
                    <i className="fas fa-save"></i>
                  </button>
                </div>
              </div>

              <div className="row m-4 align-items-center">
                <div className="">
                  <button
                    type="button"
                    className="mx-4 py-2 px-4 bg-primary text-white border-0 rounded"
                    hidden={edit || role !== "Head"}
                    onClick={() => {
                      setEdit(true);
                    }}
                  >
                    <h6 className="text-white">Edit MoocList</h6>
                  </button>
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="mx-4 py-2 px-4 bg-primary text-white border-0 rounded"
                    hidden={!edit || role !== "Head" || edit2}
                    onClick={() => {
                      discardChange();
                    }}
                  >
                    <h6 className="text-white">Cancel</h6>
                  </button>
                </div>
                <div className="col">
                  <button
                    className="mx-4 py-2 px-4 bg-primary text-white border-0 rounded"
                    hidden={!edit || role !== "Head" || edit2}
                    type="button"
                    onClick={() => {
                       sendCampaignMoocsList();
                    }}
                  >
                    <h6 className="text-white">Save</h6>
                  </button>
                </div>
              </div>
            </Box>
          </div>
        </div>
      </div>
    </form>
  );
};
export default CampaignMoocList;

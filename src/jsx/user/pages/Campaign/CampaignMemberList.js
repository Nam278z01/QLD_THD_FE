import { useEffect, useState, useContext, useCallback } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import { updateCampaignMemberList } from "../../../../services/CampaignAPI";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { Autocomplete, TextField } from "@mui/material";
import { getAllMem } from "../../../../services/UsermasterAPI";
import { getAllActiveMem } from "../../../../services/UsermasterAPI";

const CampaignMemberList = ({datas}) =>{

  const defaultmember = {
    Account:"",
    ID: 0
  }
  const IDList = [];
  const ListCurrentMembers = [];

    const { role } = useSelector((state) => state.UserSlice);
    const [data,setData] = useState(datas);
    const [members,setMembers] = useState(data.UserMasters);
    const navigate = useHistory();
    const id = useParams().ID;
    const ID = parseInt(datas.ID);
    const { getToken } = useContext(GetTokenContext); 
    const [originalData,setOriginalData] = useState(data);
    const [edit,setEdit] = useState(false);
    const [allMemberList, setRefresh, setAllMemberList] = useRefreshToken(getAllActiveMem);
    const [cloneAllMemberList, setRefresh2, setCloneAllMemberList] = useRefreshToken(getAllActiveMem);
    const [selectedMember,setSelectedMember] = useState(defaultmember);
    const [first,setFirst] = useState(true);
    const [check,setCheck] = useState(true);
    useEffect(() => {
      if (first && allMemberList !== null) {
        setFirst(false);
        setCheck(true);
        const setOptions = async () => {
          if(allMemberList!==null){
          if(cloneAllMemberList!==null)
          await setAllMemberList(cloneAllMemberList);
          await members.map((x) => {
            ListCurrentMembers.push(x.ID);
          })
          await setAllMemberList(allMemberList.filter((x) => !ListCurrentMembers.includes(x.ID)));     
    
         }
      }
      setOptions(); 
      }
      
        
    },[allMemberList]);

    const discardChange = () =>{
      setData(originalData);
      setEdit(false);
      setSelectedMember(defaultmember);
      // window.location.reload();
    }

    useEffect(() => {
      setMembers(data.UserMasters);
      const setOptions = async () => {
          if(allMemberList!==null){
          if(cloneAllMemberList!==null)
          await setAllMemberList(cloneAllMemberList);
          await members.map((x) => {
            ListCurrentMembers.push(x.ID);
          })
          await setAllMemberList(cloneAllMemberList.filter((x) => !ListCurrentMembers.includes(x.ID)));     
    
         }
      }
      setOptions();    
    },[data]);

    const removeMember = (member) => {
        if (edit) {
          setMembers(members.filter((x) => x.ID != member.ID));
        }
    };
    
    useEffect(()=>{
      //truyen du lieu cho add members
      if (check){
        if ((members.filter((x) => x.ID === selectedMember.ID).length === 0) && selectedMember.ID !== defaultmember.ID) {
          addMember(selectedMember);
          setSelectedMember(defaultmember);
        }
        setCheck(false);
      } else {
        setCheck(true);
      }
    },[selectedMember])
    
    const addMember = (member) => {
      if (edit) {
        setMembers([...members, member]);
      }
    };
    
    useEffect(() => {
      
        setData({
          ID: data.ID,
          UserMasters: members,
        });
       
    }, [members]);


    function sendCampaignMemberList() {

      data.UserMasters.map((x) => {
        IDList.push(x.ID);
      })

      function success() {
          navigate.push(`/campaign-detail/${ID}`);
      }

      if (ID != 0) {
          getToken(
              updateCampaignMemberList,
              "Campaign member list has been updated",
              success,
              false,
              ID,
              IDList
          );
      } 
      setOriginalData(data);

    }

    return (
        <div className="col col-6 " hidden={ID == 0 || (role !== "Head" && data.UserMasters.length === 0)}>
            <div className="row" style={{ minHeight: 55 }}>
              <span className="col-8 text-primary">Member:</span>
              <Autocomplete
                hidden={!edit || first}  
                className="col-3"
                value={selectedMember.Account}
                onChange={ 
                  (event, newValue) => {
                  if (newValue) setSelectedMember(newValue);
                  }
                }
            
                id="group-search-bar"
                freeSolo
                getOptionLabel={(option) => {
                  if (typeof option === 'string') {
                    return option;
                  }
                  return option.Account;
                }}
                options={allMemberList}
                renderOption={(props, option) => <li {...props}>{option.Account}</li>}
                renderInput={(params) => 
                  <TextField 
                    {...params} 
                    label="Search Member"
                  />}
              />
            </div>
            <div
              className="row rounded border col-11 p-4 mx-1"
              style={{ minHeight: 150 }}
            >
              {data.UserMasters.map((i) => (
                <div className="col m-2">
                  <div className="bg-success d-inline text-white text-nowrap rounded p-2 mx-1 border-0">
                    <span className="">{i.Account}{" "}</span>
                    <button
                      className=" bg-success d-inline text-white text-nowrap border-0"
                      key={i.ID}
                      onClick={() => {
                        removeMember(i);
                      }}
                    >
                      <i className="fas fa-trash" hidden={!edit}></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="row m-4 align-items-center">
              <div className="">
                <button
                  className="mx-4 py-2 px-4 bg-primary text-white border-0 rounded"
                  hidden={edit || role !== "Head"}
                  onClick={() => {
                  setEdit(true);
                  }}>
                  <h6 className="text-white">Edit Member</h6>
                </button>
              </div>
              <div className="col"> 
                <button
                  className="mx-4 py-2 px-4 bg-primary text-white border-0 rounded"
                  hidden={!edit || role !== "Head"} 
                  onClick={() => {
                  discardChange();
                  }}>
                  <h6 className="text-white">Cancel</h6>
                </button>
              </div>
              <div className="col">
                <button
                  className="mx-4 py-2 px-4 bg-primary text-white border-0 rounded"
                  hidden={!edit || role !== "Head"}
                  onClick={() => {
                    sendCampaignMemberList();
                    setEdit(false);
                  }}>
                  <h6 className="text-white">Save</h6>
                </button>
              </div>
            </div>
        </div>
    )

}
export default CampaignMemberList; 
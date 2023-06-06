import { useEffect, useState, useContext, useCallback } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import {  updateCampaignGroupList } from "../../../../services/CampaignAPI";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getGroupList } from "../../../../services/GroupCampaignAPI";
import { Autocomplete,  TextField } from "@mui/material";
import { updateCampaignMemberList } from "../../../../services/CampaignAPI";
import { getActiveGroupList } from "../../../../services/GroupCampaignAPI";

const CampaignGroupList = ({datas}) =>{

    const defaultgroup = {
      Name:"",
      ID: 0
    }
    const IDList = [];
    const GroupIDList = [];
    const [allGroupList, setRefresh, setAllGroupList] = useRefreshToken(getActiveGroupList);
    const [cloneAllGroupList, setRefresh2, setCloneAllGroupList] = useRefreshToken(getActiveGroupList);
    const [listGroup,setListGroup] = useState();
    const [selectedGroup,setSelectedGroup] = useState(defaultgroup);
    const { role } = useSelector((state) => state.UserSlice);
    const [data,setData] = useState(datas);
    const [groups,setGroups] = useState(data.Groups);
    const [members,setMembers] = useState(data.UserMasters);
    const navigate = useHistory();
    const id = useParams().ID;
    const ID = parseInt(datas.ID);
    const { getToken } = useContext(GetTokenContext);
    const [originalData,setOriginalData] = useState(data);
    const [listUserMasterID,setlistUserMasterID] = useState(datas.UserMasters);
    const [edit,setEdit] = useState(false);
    const [first,setFirst] = useState(true);
    const [check,setCheck] = useState(true);
    useEffect(() => {
      if (first && allGroupList !== null && cloneAllGroupList !==null) {
        setAllGroupList(allGroupList.GroupCampaignData.filter((x) => x.Status === 1));
        setFirst(false);
        setCheck(true);
        const setOptions = async () => {
          if(allGroupList!==null){
            if(cloneAllGroupList!==null)
            await setAllGroupList(cloneAllGroupList);
            await groups.map((x) => {
              GroupIDList.push(x.ID);
            })
            await setAllGroupList(allGroupList.GroupCampaignData.filter((x) => !GroupIDList.includes(x.ID)));         
           }
        }
        setOptions(); 
      }
    },[allGroupList,cloneAllGroupList]);
    const discardChange = () =>{
      setData(originalData);
      setSelectedGroup(defaultgroup);
      setEdit(false);
    }
    useEffect(() => {
      setGroups(data.Groups);
      const setOptions = async () => {
        if(allGroupList!==null){
          if(cloneAllGroupList!==null){
            await setAllGroupList(cloneAllGroupList.GroupCampaignData);
          }
          await groups.map((x) => {
            GroupIDList.push(x.ID);
          })
          await setAllGroupList(cloneAllGroupList.GroupCampaignData.filter((x) => !GroupIDList.includes(x.ID)));    
         }
      }
      setOptions(); 
    },[data]);

    const removeGroup = (group) => {
        if (edit) {
          setGroups(groups.filter((x) => x.ID != group.ID));
        }
    };
    const setOptions = async () => {
      if(allGroupList!==null){
        
        await groups.map((x) => {
          GroupIDList.push(x.ID);
        })
        await setAllGroupList(cloneAllGroupList.GroupCampaignData.filter((x) => !GroupIDList.includes(x.ID)));    
       }
    }
    useEffect(()=>{
      //truyen du lieu cho add group
      if (check) {
      if ((groups.filter((x) => x.ID === selectedGroup.ID)).length == 0 && selectedGroup.ID !== defaultgroup.ID){
        addGroup(selectedGroup);
      } 
      setSelectedGroup(defaultgroup);
      setCheck(false);
      } else {
        setCheck(true);
      }
    },[selectedGroup])

    const addGroup = (group) => {
      if (edit) {
        setGroups([...groups, group]);
      }
    };
  
    useEffect(() => {
        setData({
          ID: data.ID,
          Groups: groups,
        });
    }, [groups]);

    function sendCampaignGroupList() {

      data.Groups.map((x) => {
        IDList.push(x.ID);
      })
      function success() {
          window.location.reload();
      }

      if (ID != 0) {
          getToken(
              updateCampaignGroupList,
              "Campaign group list has been updated",
              success,
              false,
              ID,
              IDList
          );
      }
    //   if (ID != 0) {
    //     getToken(
    //         updateCampaignMemberList,
    //         "Campaign Member List Has Been Updated",
    //         success,
    //         false,
    //         ID,
    //         MemberIDList
    //     );
    // } 
      setOriginalData(data);

  }

  return (
      <div className="col col-6" hidden={ID == 0 || (role !== "Head" && data.Groups.length === 0)}>
        <div className="row" style={{ minHeight: 55 }}>
          <span className="col-8 text-primary">Group:</span>
          <Autocomplete
            hidden={!edit || first}  
            className="col-3"
            value={selectedGroup.Name}
            onChange={ 
              (event, newValue) => {
                setOptions();
              if (newValue) setSelectedGroup(newValue);
              }
            }
            
            id="group-search-bar"
            freeSolo
            getOptionLabel={(option) => {
              if (typeof option === 'string') {
                return option;
              }
              return option.Name;
            }}
            options={allGroupList}
            renderOption={(props, option) => <li {...props}>{option.Name}</li>}
            renderInput={(params) => 
              <TextField 
                {...params} 
                label="Search Group"
              />}
          />
        </div>  
          <div className="row rounded border col-11 p-4 mx-1"
              style={{ minHeight: 150 }}>
              {data.Groups.map((i) => (
              <div className="col m-2">
                <div className="bg-primary d-inline text-white text-nowrap rounded p-2 mx-2 border-0">
                  {i.Name}{" "}
                  <button
                      className="bg-primary d-inline text-white text-nowrap border-0"
                      key={i.ID}
                      onClick={() => {
                        removeGroup(i);
                      }}
                  >
                      <i className="fas fa-trash" hidden={!edit}></i>
                  </button>
                </div>
              </div>
              ))}
          </div>

          <div className="">
            <div className="row m-4 align-items-center">
              <div className="">
                <button
                  className="mx-4 py-2 px-4 bg-primary text-white border-0 rounded"
                  hidden={edit || role !== "Head"}
                  onClick={() => {
                  setEdit(true);
                  }}>
                  <h6 className="text-white">Edit Group</h6>
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
                    sendCampaignGroupList();
                    setEdit(false);
                  }}>
                  <h6 className="text-white">Save</h6>
                </button>
              </div>
            </div>
          </div>
      </div>
    )
};
export default CampaignGroupList; 
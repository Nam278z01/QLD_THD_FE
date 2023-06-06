import { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/NativeSelect';
import { Autocomplete, TextField } from '@mui/material';
import useRefreshToken from '../../../../Hook/useRefreshToken';
import {
    createFsu,
    getAllDepartment,
    getAllDepartmentCanBeGroupChild,
    getAllDepartmentGroupChild,
    getAllGroupChild,
    updateFsu
} from '../../../../services/GroupChildAPI';
import { GetTokenContext } from '../../../../context/GetTokenContext';
import { getAllDepartmentFsu, updateDepartment, updateFsutoBu } from '../../../../services/DepartmentAPI';
import Swal from 'sweetalert2';
export default function FSUSetting({
    show,
    setShow,
    depaDetail,
    setRefresh,
    groupChildListFsu,
    setRefresh2,
    SetGroupChildListFsu,
    groupChildList,
    setGroupChildList,
    selectedGroupChild,
    setRefresh1,
    setSelectedGroupChild
}) {
    //hien tai con chua khoi tao groupchillist = originalGroupChildList - selectedGroupChild, chua co ham cancel setting (refresh cac setting chua duoc luu)

    // hien tai dang su dung du lieu fake. can them API lay ra list cac department (originalGroupChildList), lay ra cac department con cua fsu hien tai(selectedGroupChild), neu lan dau set department hien tai thanh fsu thi list nay trong.
    // groupchillist = originalGroupChildList - selectedGroupChild
    // cam them API de luu lai hoac cap nhat list cac department con neu set department hien tai thanh FSU
    // neu department da la FSU va dang co cac department con thi khong cho phep set tro lai lam BU

    const { getToken, getTokenFormData } = useContext(GetTokenContext);

    const BUorFSU = [
        {
            item: 0,
            label: 'FSU'
        },
        {
            item: 1,
            label: 'BU'
        }
    ];
    const test = [
        {
            ID: 1,
            Code: 'Test1',
            label: 'Test1'
        },
        {
            ID: 2,
            Code: 'Test2',
            label: 'Test2'
        }
    ];
    const [originalGroupChildList, setOriginalGroupChildList] = useRefreshToken(
        getAllDepartmentCanBeGroupChild,
        depaDetail.Code
    );
    getAllDepartmentFsu;
    const [DepartmentFsuData, SetDepartmentFsuData] = useRefreshToken(getAllDepartmentFsu, depaDetail.ID);
    //API lay tat ca cac department co the  lam group child cua department hientai
    //API lay tat ca cac group child cua department hien tai
    // const groupChildList = originalGroupChildList - selectedGroupChild
    // useEffect(() => {
    //   if (originalGroupChildList !== null)
    //     setGroupChildList(originalGroupChildList);
    // }, [originalGroupChildList]);
    // const [groupChildList,setGroupChildList] = useState(originalGroupChildList !== null ? originalGroupChildList: []); // groupchildlist la list cac department chua chon lam con cua FSU hien tai cho search box
    const [fsu, setFsu] = useState(true); // = useState(depaDetail.FSU)
    // const [selectedBU, setSelectedBU] = useState(null);
    const [one, setOne] = useState(false);
    const handleChange = (event) => {
        setFsu(event.target.value === '0' ? true : false);
    };

    const removeGroupChild = (x) => {
        setGroupChildList([...groupChildList, x]);
        setSelectedGroupChild(selectedGroupChild.filter((a) => a.ID !== x.ID));
    };

    const removeGroupChild1 = (x) => {
        setGroupChildList([...groupChildList, x]);
        SetGroupChildListFsu(groupChildListFsu.filter((a) => a.ID !== x.ID));
    };

    const saveFsuSetting = () => {
        let body = {
            DepartmentID: depaDetail.ID,
            Name: depaDetail.Code,
            Description: 'create ' + depaDetail.Code + ' become FSU',
            ListGroupChild: selectedGroupChild.filter((list) => list.ID !== depaDetail.ID).map((x) => x.ID)
        };
        function success() {
            setRefresh1(new Date());
            setRefresh(new Date());
            setRefresh2(new Date());
            SetDepartmentFsuData(new Date());
            setShow(false);
            setOne(false);
            setGroupChildList(new Date());
        }

        getToken(createFsu, 'create ' + depaDetail.Code + ' become FSU successful', success, false, body);
    };
    const updateFsuSetting = () => {
        let body = {
            IsFsu: 1,
            DepartmentID: depaDetail.ID,
            Status: 1,
            ListGroupChild:
                groupChildListFsu.length > 0
                    ? groupChildListFsu.filter((list) => list.ID !== depaDetail.ID).map((x) => x.ID)
                    : selectedGroupChild.filter((list) => list.ID !== depaDetail.ID).map((x) => x.ID)
        };
        function success() {
            setRefresh1(new Date());
            SetDepartmentFsuData(new Date());
            setShow(false);
            setRefresh(new Date());
            setRefresh2(new Date());
            setOne(false);
            setGroupChildList(new Date());
        }

        getToken(updateFsu, 'Update Success ', success, false, body);
    };
    const ChangeFsutoBu = () => {
        Swal.fire({
            title: 'Do you want to change department to bu  ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                function success() {
                    setRefresh1(new Date());
                    SetDepartmentFsuData(new Date());
                    setShow(false);
                    setRefresh(new Date());
                    setRefresh2(new Date());
                    setOne(false);
                    setGroupChildList(new Date());
                }

                getToken(updateFsutoBu, 'Change Fsu to Bu Success ', success, false, {}, depaDetail.ID);
            }
        });
    };
    const cancelFsuSetting = () => {
        setGroupChildList(new Date());
        setShow(false);
        setRefresh1(new Date());
        setRefresh2(new Date());
        setOne(false);
    };
    return selectedGroupChild === null ||
        groupChildList === null ||
        groupChildListFsu === null ||
        DepartmentFsuData === null ? (
        <></>
    ) : (
        <Modal
            show={show}
            centered
            onHide={() => {
                setShow(false);
                setRefresh1(new Date());
                setRefresh2(new Date());
                setOne(false);
            }}
            size="lg"
            backdrop="static"
        >
            <Modal.Header closeButton>{depaDetail.Code} Setting!</Modal.Header>
            <Modal.Body>
                <div className="col row">
                    <FormControl className="col-1">
                        <Select
                            id="fsu-or-bu-select"
                            defaultValue={fsu ? 0 : 1}
                            inputProps={{
                                name: 'BUtype',
                                id: 'uncontrolled-native'
                            }}
                            onChange={handleChange}
                        >
                            {BUorFSU.map((x, i) => (
                                <option value={x.item} id={'bu-or-fsu-select-item-' + x.item} key={i}>
                                    {x.label}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    {fsu ? (
                        <div className="text-danger col-11">
                            <h4 className="text-danger">Set Fsu</h4>
                        </div>
                    ) : (
                        <div className="text-danger col-11">
                            <h4 className="text-danger">Change Fsu To Bu</h4>
                        </div>
                    )}
                    <hr></hr>
                    <div className="row" hidden={!fsu}>
                        <span>LIST GROUP CHILD</span>
                        <br></br>
                        <br></br>
                        {groupChildListFsu.length > 0 ? (
                            <Autocomplete
                                hidden={groupChildList.length === 0}
                                placeholder="Select"
                                className="col-4 mx-2"
                                onChange={(event, newValue) => {
                                    if (newValue !== null) {
                                        setGroupChildList(groupChildList.filter((x) => x.ID !== newValue.ID));
                                        SetGroupChildListFsu([...groupChildListFsu, newValue]);
                                    }
                                    setOne(false);
                                }}
                                id="group-search-bar"
                                freeSolo
                                getOptionLabel={(option) => {
                                    if (typeof option === 'string') {
                                        return option;
                                    }
                                    return option.Code;
                                }}
                                options={groupChildList.filter(
                                    ({ label: id1 }) => !groupChildListFsu.some(({ label: id2 }) => id2 === id1)
                                )}
                                renderOption={(props, option) => <li {...props}>{option.Code}</li>}
                                renderInput={(params) => <TextField {...params} label="" />}
                            />
                        ) : (
                            <Autocomplete
                                hidden={groupChildList.length === 0}
                                placeholder="Select"
                                className="col-4 mx-2"
                                onChange={(event, newValue) => {
                                    if (newValue !== null) {
                                        setGroupChildList(groupChildList.filter((x) => x.ID !== newValue.ID));
                                        setSelectedGroupChild([...selectedGroupChild, newValue]);
                                    }
                                    setOne(false);
                                }}
                                id="group-search-bar"
                                freeSolo
                                getOptionLabel={(option) => {
                                    if (typeof option === 'string') {
                                        return option;
                                    }
                                    return option.Code;
                                }}
                                options={groupChildList.filter(
                                    ({ label: id1 }) => !selectedGroupChild.some(({ label: id2 }) => id2 === id1)
                                )}
                                renderOption={(props, option) => <li {...props}>{option.Code}</li>}
                                renderInput={(params) => <TextField {...params} label="" />}
                            />
                        )}

                        <div className="col row">
                            {groupChildListFsu.length > 0
                                ? groupChildListFsu
                                      .filter((list) => list.ID !== depaDetail.ID)
                                      .map((x, i) => (
                                          <div className="col " id={'group-child-item-' + i} key={i}>
                                              <div className="d-inline text-nowrap rounded border-0  ">
                                                  {x.Code}{' '}
                                                  <button
                                                      className=" d-inline text-nowrap border-0 "
                                                      key={x.ID}
                                                      onClick={() => {
                                                          groupChildListFsu.filter((list) => list.ID !== depaDetail.ID)
                                                              .length <= 1
                                                              ? setOne(true)
                                                              : removeGroupChild1(x);
                                                      }}
                                                  >
                                                      <i className="fas fa-trash"></i>
                                                  </button>
                                              </div>
                                              {one ? (
                                                  <span className="fst-normal text-danger">
                                                      {' '}
                                                      (Fsu setting must have at least one department)
                                                  </span>
                                              ) : (
                                                  ''
                                              )}
                                          </div>
                                      ))
                                : selectedGroupChild
                                      .filter((list) => list.ID !== depaDetail.ID)
                                      .map((x, i) => (
                                          <div className="col " id={'group-child-item-' + i} key={i}>
                                              <div className="d-inline text-nowrap rounded border-0  ">
                                                  {x.Code}{' '}
                                                  <button
                                                      className=" d-inline text-nowrap border-0 "
                                                      key={x.ID}
                                                      onClick={() => {
                                                          selectedGroupChild.filter((list) => list.ID !== depaDetail.ID)
                                                              .length <= 1
                                                              ? setOne(true)
                                                              : removeGroupChild(x);
                                                      }}
                                                  >
                                                      <i className="fas fa-trash"></i>
                                                  </button>
                                              </div>
                                              {one ? (
                                                  <span className="fst-normal text-danger">
                                                      {' '}
                                                      (Fsu setting must have at least one department)
                                                  </span>
                                              ) : (
                                                  ''
                                              )}
                                          </div>
                                      ))}
                        </div>
                    </div>

                    <br></br>
                    <div className="row">
                        <div className="col-6 text-end"></div>
                        {fsu ? (
                            <>
                                {' '}
                                <div className="col-6 text-end">
                                    {DepartmentFsuData.length > 0 ? (
                                        <button
                                            className="col mx-4 d-inline text-nowrap border-0 btn btn-primary"
                                            onClick={() => {
                                                updateFsuSetting();
                                            }}
                                        >
                                            Update
                                        </button>
                                    ) : (
                                        <button
                                            className="col mx-4 d-inline text-nowrap border-0 btn btn-primary"
                                            onClick={() => {
                                                saveFsuSetting();
                                            }}
                                        >
                                            Save
                                        </button>
                                    )}

                                    <button
                                        className="col mx-4 d-inline text-nowrap border-0 btn btn-danger"
                                        onClick={() => {
                                            cancelFsuSetting();
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="col-6 text-end">
                                    <button
                                        className="col mx-4 d-inline text-nowrap border-0 btn btn-primary"
                                        onClick={() => {
                                            ChangeFsutoBu();
                                        }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="col mx-4 d-inline text-nowrap border-0 btn btn-danger"
                                        onClick={() => {
                                            cancelFsuSetting();
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

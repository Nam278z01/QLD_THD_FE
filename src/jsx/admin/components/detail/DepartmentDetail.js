import { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import BUlInfoCard from '../card/BULInfoCard';
import AddBULModal from '../modal/AddBULModal';
import SettingDetail from './SettingDetail';
import { useHistory } from 'react-router-dom';
import { updateDepartment } from '../../../../services/DepartmentAPI';
import { GetTokenContext } from '../../../../context/GetTokenContext';
import FSUSetting from '../modal/FSUSetting';
import {
    getAllDepartment,
    getAllDepartmentGroupChild,
    getAllDepartmentWithNoParent,
    getAllGroupChild
} from '../../../../services/GroupChildAPI';
import useRefreshToken from '../../../../Hook/useRefreshToken';
import Swal from 'sweetalert2';
export default function DepartmentDetail({ depaSetting, BUList, depaDetail, setRefresh, defaultHead }) {
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const { getToken } = useContext(GetTokenContext);
    const navigate = useHistory();
    const [groupChildListFsu, setRefresh2, setGroupChildListFsu] = useRefreshToken(
        getAllDepartmentGroupChild,
        depaDetail.ID
    );
    const [groupChildList, setnewgroupChildList] = useRefreshToken(getAllGroupChild, depaDetail.Code);
    const [selectedGroupChild, setRefresh1, setSelectedGroupChild] = useRefreshToken(getAllGroupChild, depaDetail.Code);
    const [groupChildList2, setGroupChildList] = useRefreshToken(getAllDepartmentWithNoParent, depaDetail.ID);

    function success() {
        setRefresh(new Date());
    }

    function setDepartmentInactive(id) {
        Swal.fire({
            title: 'Do you want to inactived department ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                getToken(
                    updateDepartment,
                    depaDetail.Code + ' Department is Inactived',
                    success,
                    false,
                    { Status: 3 },
                    id
                );
            }
        });
    }
    function setDepartmentActive(id) {
        getToken(updateDepartment, depaDetail.Code + ' Department is Actived', success, false, { Status: 2 }, id);
    }

    return groupChildList === null || groupChildList2 === null || groupChildListFsu === null ? (
        <></>
    ) : (
        <>
            <AddBULModal show={show2} setShow={setShow2} setRefresh={setRefresh} />
            <FSUSetting
                show={show3}
                setShow={setShow3}
                setRefresh={setRefresh}
                depaDetail={depaDetail}
                groupChildListFsu={groupChildListFsu}
                setRefresh2={setRefresh2}
                SetGroupChildListFsu={setGroupChildListFsu}
                groupChildList={groupChildList2.filter((list) => list.ID !== depaDetail.ID)}
                setGroupChildList={setGroupChildList}
                selectedGroupChild={selectedGroupChild}
                setRefresh1={setRefresh1}
                setSelectedGroupChild={setSelectedGroupChild}
            />
            <div className={depaDetail.Status === 3 ? 'row d-flex justify-content-center' : 'row'}>
                <div className={depaDetail.Status === 3 ? 'col-6 d-flex justify-content-center' : 'col-9'}>
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="col m-0">{depaDetail.Code} Setting</h5>

                                {depaDetail.Status === 3 ? (
                                    <Button
                                        className="mx-2"
                                        onClick={(e) => {
                                            setDepartmentActive(depaDetail.ID);
                                        }}
                                    >
                                        Active
                                    </Button>
                                ) : (
                                    <Button
                                        className="mx-2"
                                        onClick={(e) => {
                                            setDepartmentInactive(depaDetail.ID);
                                        }}
                                    >
                                        Inactive
                                    </Button>
                                )}
                            </div>

                            <div className="card-body">
                                {depaSetting !== 'NO DATA' ? (
                                    <SettingDetail depaSetting={depaSetting} />
                                ) : (
                                    <>
                                        <h5 className="text-danger"> Setting Hasn't Been Set</h5>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {depaDetail.Status === 3 ? (
                        ''
                    ) : (
                        <>
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="col m-0">{depaDetail.Code} Group Child List</h5>
                                        <Button
                                            className="mx-2 bg-warning border-danger"
                                            onClick={(e) => {
                                                setShow3(true);
                                            }}
                                        >
                                            FSU Setting
                                        </Button>
                                    </div>

                                    <div className="card-body">
                                        <div className="row text-center">
                                            {groupChildListFsu
                                                .filter((list) => list.ID !== depaDetail.ID)
                                                .map((x, i) => (
                                                    <div className="col-2 mt-1" key={i}>
                                                        <span className="badge rounded-pill text-bg-primary">
                                                            {x.Code}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {depaDetail.Status === 3 ? (
                    ''
                ) : (
                    <div className="col-3">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="m-0">{depaDetail.Code} Head List</h5>
                            </div>

                            <div className="card-body">
                                {BUList.length === 0 ? (
                                    <h6 className="text-center text-secondary">EMPTY</h6>
                                ) : (
                                    <div className="overflow-auto" style={{ maxHeight: 500, minHeight: 210 }}>
                                        {BUList.map((BUL, i) => (
                                            <BUlInfoCard
                                                depaSetting={depaSetting}
                                                defaultHead={defaultHead}
                                                info={BUL}
                                                key={i}
                                                setRefresh={setRefresh}
                                                isDefault={BUL.ID === defaultHead?.HeadID}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="card-footer">
                                {!defaultHead?.HeadID && (
                                    <Button
                                        onClick={(e) => {
                                            e.target.blur();
                                            setShow2(true);
                                        }}
                                    >
                                        Add Default Head <i className="far fa-plus" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

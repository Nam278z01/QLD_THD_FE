import { useState } from 'react';
import { Button } from 'react-bootstrap';
import useQuery from '../../../Hook/useQuery';
import useRefreshToken from '../../../Hook/useRefreshToken';
import { getAllDepartmentWithPage } from '../../../services/DepartmentAPI';
import Loading from '../../sharedPage/pages/Loading';
import AdminCardBox from '../components/adminComp/AdminCardBox';
import AddDepartmentModal from '../components/modal/AddDepartmentModal';
import { useSelector } from 'react-redux';
const AdminDashBoard = () => {
    const [show, setShow] = useState(false);
    const query = useQuery();
    const { DepartmentID, IsFsu } = useSelector((a) => a.DepartmentSettingSlice);

    const pageQuery = query.get('page');
    const rowQuery = query.get('row') || 10;
    const searchQuery = query.get('search');

    const [datas, setRefresh] = useRefreshToken(getAllDepartmentWithPage, pageQuery, rowQuery, '', searchQuery);
    const buttonShow = (
        <div className="d-flex justify-content-end">
            <Button
                onClick={() => {
                    setShow(true);
                }}
            >
                Add <i className="far fa-plus" />
            </Button>
        </div>
    );
    return datas === null ? (
        <Loading />
    ) : (
        <>
            <AddDepartmentModal show={show} setShow={setShow} setRefresh={setRefresh} />

            <AdminCardBox
                datas={datas.departmentData}
                IsFsu={IsFsu}
                totalPage={datas.totalPage}
                row={rowQuery}
                middleExtra={buttonShow}
                setRefresh={setRefresh}
            />
        </>
    );
};

export default AdminDashBoard;

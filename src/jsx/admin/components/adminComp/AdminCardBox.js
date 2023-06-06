import CustomCardUtil from '../../../user/components/Shared/CustomCardUtil';
import AdminDepartCard from './AdminDepartCard';

const AdminCardBox = ({ datas, totalPage, row, middleExtra, type, IsFsu, setRefresh }) => {
    return (
        <CustomCardUtil totalPage={totalPage} row={row} title="Department" middleExtra={middleExtra}>
            <div className="row">
                {datas.map((depa, i) => (
                    <AdminDepartCard data={depa} key={i} type={type} IsFsu={IsFsu} setRefresh={setRefresh} />
                ))}
            </div>
        </CustomCardUtil>
    );
};

export default AdminCardBox;

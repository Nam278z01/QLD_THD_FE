import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useRefreshToken from '../../../../Hook/useRefreshToken';
import { getDefaultHead2 } from '../../../../services/DefaultHeadAPI';
import Loading from '../../../sharedPage/pages/Loading';

const AdminDepartCard = ({ data, setRefresh }) => {
    const navigate = useHistory();

    const [DefaultHead] = useRefreshToken(getDefaultHead2, data.ID);
    return DefaultHead === null ? (
        // <Loading/>
        <></>
    ) : (
        <div
            className="col-md-3 col-6"
            onClick={() => {
                data.Code !== 'ADMIN' ? navigate.push(`/department/${data.ID}`) : '';
            }}
        >
            <div className={`card mousePointer ${DefaultHead.length === 0 ? 'border-danger' : ''}`}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <p className="m-0 fw-bold col-8">
                                    {data.Code} {data.IsFsu === 1 ? <i className="fas fa-crown text-warning"></i> : ''}
                                </p>
                                <span className="col-4 text-end ">
                                    {data.Status === 3 ? (
                                        <span className="badge rounded-pill bg-danger">Inactive</span>
                                    ) : (
                                        <span className="badge rounded-pill bg-success ">Active</span>
                                    )}
                                </span>
                                {/* <span className="col-1 m-0 p-0">...</span> */}
                            </div>
                            <p className="m-0 ">
                                <span className="fw-bold"> Default Head:</span>{' '}
                                {DefaultHead.length === 0 && (
                                    <>
                                        <span className={DefaultHead.length === 0 ? 'text-danger' : ''}>
                                            "Haven't Set Yet "
                                        </span>
                                    </>
                                )}
                                {DefaultHead.length === 0 && (
                                    <i className="fas fa-circle-exclamation" style={{ color: '#ef4444' }} />
                                )}
                                {DefaultHead.length !== 0 && <span>{DefaultHead[0].UserMaster?.Account}</span>}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDepartCard;

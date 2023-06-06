import { imgServer } from '../../../../dataConfig';

function SettingDetail({ depaSetting }) {
    return (
        <div className="row">
            <div className="col-xl-6">
                <div className={`form-group mb-3 row `}>
                    <label className="col-lg-4 form-label" htmlFor="DepartmentID">
                        Department Code
                    </label>

                    <div className="col-lg-8">
                        <input
                            className="form-control m-0 pe-none"
                            readOnly
                            type="text"
                            value={depaSetting.Department.Code}
                        />
                    </div>
                </div>

                <div className={`form-group mb-3 row `}>
                    <label className="col-lg-4 form-label" htmlFor="DepartmentID">
                        Department Name
                    </label>

                    <div className="col-lg-8">
                        <input
                            className="form-control m-0 pe-none"
                            readOnly
                            type="text"
                            value={depaSetting.Department.Name}
                        />
                    </div>
                </div>
                {depaSetting.DepartmentParent?.Code && (
                    <div className={`form-group mb-3 row `}>
                        <label className="col-lg-4 form-label" htmlFor="DepartmentID">
                            Superior Department
                        </label>

                        <div className="col-lg-8">
                            <input
                                className="form-control m-0 pe-none"
                                readOnly
                                type="text"
                                value={depaSetting.DepartmentParent.Code}
                            />
                        </div>
                    </div>
                )}

                <div className={`form-group mb-3 row `}>
                    <label className="col-lg-4 form-label" htmlFor="DepartmentID">
                        View Mode
                    </label>

                    <div className="col-lg-8">
                        <input className="form-control m-0 pe-none" readOnly type="text" value={depaSetting.ViewMode} />
                    </div>
                </div>

                <div className={`form-group mb-3 row `}>
                    <label className="col-lg-4 form-label" htmlFor="SMTPServer">
                        Server
                    </label>
                    <div className="col-lg-8">
                        <input
                            className={`form-control m-0 pe-none`}
                            readOnly={true}
                            id="SMTPServer"
                            name="SMTPServer"
                            value={depaSetting.SMTPServer}
                            type="text"
                        />
                    </div>
                </div>

                <div className={`form-group mb-3 row`}>
                    <label className="col-lg-4 form-label" htmlFor="SMTPPort">
                        Port
                    </label>
                    <div className="col-lg-8">
                        <input
                            className={`form-control m-0 pe-none `}
                            readOnly={true}
                            id="SMTPPort"
                            name="SMTPPort"
                            value={depaSetting.SMTPPort}
                            type="text"
                        />
                    </div>
                </div>
            </div>

            <div className="col-xl-6">
                <div className={`form-group  row`}>
                    <label className="col-lg-4 form-label" htmlFor="Logo">
                        Logo Department
                    </label>
                    <div className="col-lg-8">
                        <img src={`${imgServer}${depaSetting.Logo}`} height={56} className=" mb-3" />
                    </div>
                </div>

                <div className={`form-group mb-3 row `}>
                    <label className="col-lg-4 form-label" htmlFor="SMTPUsername">
                        UserName
                    </label>
                    <div className="col-lg-8">
                        <input
                            className={`form-control m-0 pe-none`}
                            readOnly={true}
                            type="text"
                            value={depaSetting.SMTPUsername}
                        />
                    </div>
                </div>

                <div className={`form-group mb-3 row`}>
                    <label className="col-lg-4 form-label" htmlFor="SMTPPort">
                        Point Name
                    </label>
                    <div className="col-lg-8">
                        <input
                            className={`form-control m-0 pe-none `}
                            readOnly={true}
                            id="SMTPPort"
                            name="SMTPPort"
                            value={depaSetting.PointName || 'Point'}
                            type="text"
                        />
                    </div>
                </div>

                <div className={`form-group mb-3 row`}>
                    <label className="col-lg-4 form-label" htmlFor="SMTPPort">
                        Coin Name
                    </label>
                    <div className="col-lg-8">
                        <input
                            className={`form-control m-0 pe-none `}
                            readOnly={true}
                            id="SMTPPort"
                            name="SMTPPort"
                            value={depaSetting.CoinName || 'Coin'}
                            type="text"
                        />
                    </div>
                </div>

                <div className={`form-group mb-3 row`}>
                    <label className="col-lg-4 form-label" htmlFor="SMTPPort">
                        Conversion Rate
                    </label>
                    <div className="col-lg-8">
                        <input
                            className={`form-control m-0 pe-none `}
                            readOnly={true}
                            id="SMTPPort"
                            name="SMTPPort"
                            value={depaSetting.ConversionRatio || 1}
                            type="text"
                        />
                    </div>
                </div>
                <div className={`form-group mb-3 row`}>
                    <label className="col-lg-4 form-label" htmlFor="SMTPPort">
                        Valid Distant Time
                    </label>
                    <div className="col-lg-8">
                        <input
                            className={`form-control m-0 pe-none `}
                            readOnly={true}
                            id="SMTPPort"
                            name="SMTPPort"
                            value={depaSetting.ValidDistantTime || ''}
                            type="text"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingDetail;

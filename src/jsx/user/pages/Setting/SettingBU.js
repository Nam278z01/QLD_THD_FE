import { getSetting } from "../../../../services/SettingAPI";
import { getOneDepartmentDetail } from "../../../../services/DepartmentAPI";

import { getAllUserMasterNoPageWithDepartmentID } from "../../../../services/UsermasterAPI";
import { useSelector } from "react-redux";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Loading from "../../../sharedPage/pages/Loading";
import UpdateSetting from "../../components/Forms/UpdateSetting";
import CreateSettingForm from "../../components/Forms/CreateSetting";
import BULListCard from "../../components/Card/BULListCard";
import AddBULModal from "../../components/modal/AddBULModal";
import GroupSub from "../../components/Forms/GroupSub";
import { useState } from "react";
import { getAllDepartmentFsu } from "../../../../services/ProjectAPI";
import { useEffect } from "react";
import { getAllDepartmentGroupChild } from "../../../../services/GroupChildAPI";
const SettingBU = ({ setRefresh }) => {
  const [show, setShow] = useState(false);
  const { DepartmentID, IsFsu } = useSelector((a) => a.DepartmentSettingSlice);

  const [pageURL, setPageURL] = useState("");
  useEffect(() => {
    setPageURL(window.location.pathname);
  });
  const [depaSetting] = useRefreshToken(getSetting, DepartmentID);

  const [depaDetail, setRefresh2] = useRefreshToken(
    getOneDepartmentDetail,
    DepartmentID
  );
  const [datafsu, setRefreshfsu] = useRefreshToken(getAllDepartmentFsu);
  const [groupChildListFsu, setGroupChildListFsu] = useRefreshToken(
    getAllDepartmentGroupChild,
    DepartmentID
  );

  const [allBU, setRefresh3] = useRefreshToken(
    getAllUserMasterNoPageWithDepartmentID,
    2,
    DepartmentID
  );

  const setRefreshAll = () => {
    setRefresh3(new Date());
    setRefresh2(new Date());
  };

  return depaSetting === null ||
    depaDetail === null ||
    allBU === null ||
    groupChildListFsu === null ? (
    <Loading />
  ) : (
    <>
      <AddBULModal show={show} setShow={setShow} setRefresh={setRefreshAll} />
      <div className="row">
        {IsFsu === 1 ? (
          <>
            <div className="col-8">
              {depaSetting === "NO DATA" ? (
                <CreateSettingForm setRefresh={setRefreshAll} />
              ) : (
                <UpdateSetting
                  depaSetting={depaSetting}
                  setRefresh={setRefreshAll}
                />
              )}
            </div>

            <div className="col-4">
              <GroupSub datafsu={groupChildListFsu} />
            </div>
          </>
        ) : (
          <>
            <div className="col-12">
              {depaSetting === "NO DATA" ? (
                <CreateSettingForm setRefresh={setRefreshAll} />
              ) : (
                <UpdateSetting
                  depaSetting={depaSetting}
                  setRefresh={setRefreshAll}
                />
              )}
            </div>
          </>
        )}

        {/* <div className="col-3">
          <BULListCard
            depaDetail={depaDetail}
            setRefresh={setRefreshAll}
            BUList={allBU}
            setShow={setShow}
          />
        </div> */}
      </div>
    </>
  );
};

export default SettingBU;

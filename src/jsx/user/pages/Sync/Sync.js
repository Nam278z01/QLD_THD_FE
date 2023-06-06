import { useSelector } from "react-redux";
import { useState, useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import SyncTable from "./SyncTable ";
import { getYearListSync } from "../../../../services/LeaderBoardAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import useQuery from "../../../../Hook/useQuery";
import { Fragment } from "react";
import LoadingModal from "../../components/modal/LoadingModal";
function Sync() {
  const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
  const { role } = useSelector((a) => a.UserSlice);
  const [showLoading, setShowLoading] = useState(false);

  const [year] = useRefreshToken(getYearListSync, DepartmentID);
  return year === null ? (
    <></>
  ) : (
    <>
      <LoadingModal show={showLoading} />

      <SyncTable
        setShowLoading={setShowLoading}
        datas={year}
        status={false}
        title={`${role} Sync Data List`}
        setRefresh={() => {
          setShow(new Date());
        }}
      />
    </>
  );
}

export default Sync;

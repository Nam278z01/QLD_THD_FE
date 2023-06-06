import { useSelector } from "react-redux";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getUserNotification } from "../../../../services/NotificationAPI";
import Loading from "../../../sharedPage/pages/Loading";
import NotiCard from "../../components/Card/NotiCard";

const NotificationList = () => {
  const { userID } = useSelector((state) => state.UserSlice);
  const [notiList] = useRefreshToken(getUserNotification, userID);

  return notiList === null ? (
    <Loading />
  ) : (
    <div>
      <div>
        <h3 className="">ALL NOTIFICATION</h3>
      </div>
      <div className="col">
        {notiList.map((x) => (
          <NotiCard data={x}></NotiCard>
        ))}
      </div>
    </div>
  );
};
export default NotificationList;

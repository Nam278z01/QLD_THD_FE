import "../../../../scss/components/card/card.scss";
import defaultImg from "../../../../images/Default.png";
import { imgServer } from "../../../../dataConfig";
import { useSelector } from "react-redux";

const LeaderCardTop34 = ({ data, rank }) => {
  const { PointName } = useSelector((a) => a.DepartmentSettingSlice);
  return (
    <div
      className={`p-1 d-flex align-items-center gradient-border justify-content-between ${
        rank === "1"
          ? "gradient-border-red"
          : rank === "2"
          ? "gradient-border-yellow"
          : "gradient-border-silver"
      }`}
    >
      <div className="me-2">
        <h6 className="text-center m-0 ml-2">#{rank}</h6>
      </div>

      <div style={{ width: "8%" }} className="me-2">
        <div className="w-100">
          <img
            src={data.Avatar ? data.Avatar : defaultImg}
            alt=""
            className="img-fluid rounded-circle"
          />
        </div>
      </div>
      <div className="gap-1 align-items-center justify-content-center">
        {data.badge.map((badges, i) => (
          <div key={i} className="m-0">
            <img
              src={`${imgServer}${badges}`}
              alt="badge"
              key={i}
              className="img-fluid"
              style={{ width: "1.3rem" }}
            />
          </div>
        ))}
      </div>

      <div className="ml-2" style={{ width: "30%" }}>
        <h6 className="username m-0 mb-2">{data.DisplayName}</h6>
      </div>
      <div className="w-25 ml-2">
        {/* <h6 className="text-primary m-0 mb-2">{data[2]} Point</h6> */}
        <h6 className="text-primary m-0">
          {data.point_per_day} {PointName}/Day
        </h6>
      </div>
    </div>
  );
};

export default LeaderCardTop34;

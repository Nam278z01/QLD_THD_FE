import { Button, Badge } from "react-bootstrap";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getRuleDetail } from "../../../../services/RuleAPI";
import Loading from "../../../sharedPage/pages/Loading";
import CustomModalUtil from "../Shared/CustomModalUtil";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";

export default function RuleDetailModal({ show, setShow, ruleID }) {
  const [data] = useRefreshToken(getRuleDetail, ruleID);
  const navigate = useHistory();
  const { role } = useSelector((state) => state.UserSlice);
  const { PointName, Code } = useSelector((a) => a.DepartmentSettingSlice);

  const footer = (
    <div className="d-flex justify-content-end">
      {(role === "Head" || role === "Admin") && (
        <Button
          variant="success"
          onClick={() => {
            setShow(false);
            navigate.push(`/rule/update/${data.ID}`);
          }}
        >
          Edit
        </Button>
      )}
    </div>
  );

  return data === null ? (
    <Loading />
  ) : (
    <CustomModalUtil
      middleExtra={
        <Badge
          bg={`${
            data.Status === "Active"
              ? "success"
              : data.Status === "Deleted"
              ? "danger"
              : "secondary"
          }  rounded text-white p-2 text-center user-select-none`}
        >
          {data.Status}
        </Badge>
      }
      footer={footer}
      title={data.RuleName}
      show={show}
      setShow={setShow}
      size="lg"
    >
      <div className="container">
        <div className="row ">
          <div className="col-2">
            <div className="">
              <h6 className="fw-bold">Type:</h6>
            </div>

            <div className="col">
              <div className="">
                <h6 className="fw-bold">{PointName}: </h6>
              </div>
              <div className="">
                <h6 className="fw-bold ">Category:</h6>
              </div>
              <div className="">
                <h6 className="fw-bold ">Note:</h6>
              </div>
            </div>
          </div>
          <div className="col-10 ">
            <div className="">
              <h6
                className={`${
                  data.RuleType === "Plus"
                    ? "text-success"
                    : data.RuleType === "Minus"
                    ? "text-danger"
                    : ""
                } `}
              >
                {data.RuleType}
              </h6>
            </div>
            <div className="">
              <h6 className="text-danger">{data.Point}</h6>
            </div>
            <div className="">
              <h6 className="">{data.Category}</h6>
            </div>
            <div className="">
              <h6 className="">{data.RuleNote}</h6>
            </div>
          </div>
        </div>
      </div>
    </CustomModalUtil>
  );
}

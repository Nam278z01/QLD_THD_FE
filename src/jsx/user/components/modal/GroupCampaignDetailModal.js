import { Button } from "react-bootstrap";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Loading from "../../../sharedPage/pages/Loading";
import CustomModalUtil from "../Shared/CustomModalUtil";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getGroupCampaignDetail } from "../../../../services/GroupCampaignAPI";
export default function GroupCampaignDetailModal({
  show,
  setShow,
  groupcampaignID,
}) {
  const [data] = useRefreshToken(getGroupCampaignDetail, groupcampaignID);
  const navigate = useHistory();
  const { role } = useSelector((state) => state.UserSlice);
  const footer =
    data === null ? (
      <Loading />
    ) : (
      <div className="d-flex justify-content-end">
        {role === "Head" && (
          <>
            <div>
              <Button
                variant="primary"
                onClick={() => {
                  setShow(false);
                  navigate.push(`/detail-groupcampaign/${data.ID}`);
                }}
              >
                Update
              </Button>
            </div>
          </>
        )}
      </div>
    );

  return data === null ? (
    <Loading />
  ) : (
    <CustomModalUtil
      centered
      footer={footer}
      show={show}
      setShow={setShow}
      size="xl"
    >
      <div className="col">
        <div className="row">
          <h1 className="col-10 text-blue">Group Detail</h1>
          <div className="col-2  text-end pt-2 ">
            <span
              class={data.Status === 1 ? "badge bg-success" : "badge bg-danger"}
            >
              {data.Status === 1 ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className="col border">
          <div className="row m-2">
            <div className="col col-6" style={{ minHeight: 100 }}>
              <span className="text-primary">Group Name:</span>
              <div className="col-11 d-flex flex-row rounded border p-2">
                <div type="text" className="col-12 border-0">
                  {data.Name}
                </div>
              </div>
            </div>
          </div>

          <div className="row m-2">
            <div className="col col-6 ">
              <span className="text-primary">Member:</span>
              <div
                className="row rounded border col-11 p-4 mx-1"
                style={{ minHeight: 250 }}
              >
                <div>
                  {data.UserMasters.length > 0 ? (
                    data.UserMasters.map((d, index) => <div>{d.Account}</div>)
                  ) : (
                    <p>No data</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-6 col">
              <div className="d-flex flex-column my-2">
                <span className="text-primary">Description:</span>
                <div
                  type="text"
                  className="col-11 d-flex flex-row rounded border p-2"
                  style={{ minHeight: 80 }}
                >
                  {data.ShortDescription}
                </div>
              </div>
              <div className="d-flex flex-column my-2">
                <span className="text-primary">Note:</span>
                <div
                  type="text"
                  className="col-11 d-flex flex-row rounded border p-2"
                  style={{ minHeight: 130 }}
                >
                  {data.DetailDescription}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModalUtil>
  );
}

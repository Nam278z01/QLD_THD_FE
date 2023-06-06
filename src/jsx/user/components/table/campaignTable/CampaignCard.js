import { Link } from "react-router-dom";
import { Status, Server } from "../../../../../dataConfig";
import product7 from "../../../../../images/product/7.jpg";

const CampaignCard = ({ data }) => {
  return (
    <div className="col-lg-12 col-md-6 col-xl-4">
      <div className="card shadow">
       
        <div className="card-body">
          <div className="row">
            <div className="new-arrival-product mb-4 mb-xxl-4 mb-md-0 col-4">
              {/* <img
                className="img-fluid"
                src={
                  data.ImageURL
                    ? `${Server.replace("/api/v1", "")}/public/campaign/${
                        data.ImageURL
                      }`
                    : product7
                }
                alt=""
              /> */}
            </div>
            <div className="col-8">
              <div className="new-arrival-content">
                <h3 className="event-name text-black">{data.Name}</h3>
                
                <div className="star-rating">
                  <h4>
                    <i className="fas fa-users"></i> 30/201
                  </h4> 
                  <div>
                    <h4 className="text-danger">
                      <i className="fas fa-sack-dollar" />{" "}
                      {data.Budget ? `${data.Budget} Points` : "No Limit"}
                    </h4>
                  </div>
                </div>
                <div>
                  <p>
                    Availability:{" "}
                    <span className="item">
                      {Status.Event[data.Status - 1]}{" "}
                      {data.Status == 1 ? (
                        <i className="fa-solid fa-clock text-warning fa-beat-fade"></i>
                      ) : data.Status == 2 ? (
                        <i className="fa fa-check-circle text-success fa-beat-fade" />
                      ) : (
                        <i className="fa fa-times-circle text-danger fa-beat-fade" />
                      )}
                    </span>
                  </p>
                </div>
                <p>
                  <i className="fa-solid fa-calendar-days"></i> :{" "}
                  <span className="item">
                    {new Date(data.StartDate).toLocaleDateString()}
                    {" - "}
                    {new Date(data.EndDate).toLocaleDateString()}
                  </span>{" "}
                </p>

                <p className="event-description">
                  {data.Description.length >= 80
                    ? `${data.Description.substring(0, 80)}...`
                    : data.Description}
                </p>
                <Link
                  className="product-review"
                  to={`/campaign-detail/${data.ID}`}
                  data-toggle="modal"
                >
                  More Detail...
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;

import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

const WIP = () => {
  const body = document.querySelector("body");
  body.setAttribute("data-primary", "color_1");

  const { url } = useRouteMatch();
  return (
    <div className="authincation h-100 p-meddle">
      <div className="container h-100">
        <div className="row justify-content-center h-100 align-items-center ">
          <div className="col-md-5">
            <div className="form-input-content text-center error-page">
              <h1 className="error-text font-weight-bold">W.I.P</h1>
              <h4>
                <i className="fa fa-exclamation-triangle text-warning" /> A new
                feature we currently working on
              </h4>
              <p>please go back</p>
              <div>
                <Link
                  className="btn btn-primary"
                  to={`/leaderboard?year=${new Date().getFullYear()}&month=${
                    new Date().getMonth() + 1
                  }`}
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WIP;

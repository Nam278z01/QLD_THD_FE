import React from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

const Error404BackToWelcome = () => {
  const body = document.querySelector("body");
  body.setAttribute("data-primary", "color_1");
  const { roleID } = useSelector((a) => a.UserSlice);

  return (
    <div className="authincation h-100 p-meddle">
      <div className="container h-100">
        <div className="row justify-content-center h-100 align-items-center ">
          <div className="col-md-5">
            <div className="form-input-content text-center error-page">
              <h1 className="error-text font-weight-bold">404</h1>
              <h4>
                <i className="fa fa-exclamation-triangle text-warning" /> The
                page you were looking for Not Have Setting Yet.
              </h4>
              <p>Department Not Have Setting Yet.</p>
              <div>
                <Link className="btn btn-primary" to={""}>
                  Back Department Select
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404BackToWelcome;

import React from "react";
import { useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { AuthenButton } from "../components/PluginsMenu/AuthenButton/AuthenButton";

const Error403 = ({ fontValidate }) => {
  const body = document.querySelector("body");
  body.setAttribute("data-primary", "color_1");

  const { role } = useSelector((a) => a.UserSlice);

  return (
    <div className="authincation h-100 p-meddle">
      <div className="container h-100">
        <div className="row justify-content-center h-100 align-items-center ">
          <div className="col-md-5">
            <div className="form-input-content text-center error-page">
              <h1 className="error-text  font-weight-bold">403</h1>
              <h4>
                <i className="fa fa-times-circle text-danger" /> Forbidden
                Error!
              </h4>
              <p>You do not have permission to view this resource.</p>
              <div>
                {fontValidate ? (
                  <>
                    <Link className="btn btn-primary" to={`/`}>
                      Back to Front Page
                    </Link>

                    <AuthenButton />
                  </>
                ) : role == "Admin" ? (
                  <Link className="btn btn-primary" to={`/dashboard`}>
                    Back to Home
                  </Link>
                ) : (
                  <Link className="btn btn-primary" to={`/point/request`}>
                    Back to Home
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error403;
import React from "react";
import { Link } from "react-router-dom";
import { AuthenButton } from "../components/PluginsMenu/AuthenButton/AuthenButton";

const Error500 = (props) => {
  const body = document.querySelector("body");
  body.setAttribute("data-primary", "color_1");
  return (
    <div className={`authincation h-100 ${props.className}  p-meddle`}>
      <div className="container h-100">
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-5">
            <div className="form-input-content text-center error-page">
              <h1 className="error-text font-weight-bold">500</h1>
              <h4>
                <i className="fa fa-times-circle text-danger" /> Internal Server
                Error
              </h4>
              <p>You do not have permission to view this resource</p>

              <AuthenButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error500;

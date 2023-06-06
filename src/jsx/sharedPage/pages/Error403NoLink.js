import React from "react";
import { AuthenButton } from "../components/PluginsMenu/AuthenButton/AuthenButton";

const Error403NoLink = () => {
  const body = document.querySelector("body");
  body.setAttribute("data-primary", "color_1");
  return (
    <div className="authincation vh-100">
      <div className="container vh-100">
        <div className="row justify-content-center h-100 align-items-center ">
          <div className="col-md-5">
            <div className="form-input-content text-center error-page">
              <h1 className="error-text font-weight-bold">403</h1>
              <h4>
                <i className="fa fa-times-circle text-danger" /> Forbidden
                Error!
              </h4>
              <p>You do not have permission to view this resource.</p>
              <AuthenButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error403NoLink;

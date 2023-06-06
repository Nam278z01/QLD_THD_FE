import React from "react";
import { useHistory } from "react-router-dom";

function goToTop() {
  window.scrollTo(0, 0);
}

const PageTitle = () => {
  const navigate = useHistory();

  return (
    <div className="row page-titles m-0 px-0">
      <ol className="breadcrumb">
        <li className="breadcrumb-item active">
          <a
            className="mousePointer"
            onClick={() => {
              navigate.goBack();
              goToTop();
            }}
          >
            Go Back
          </a>
        </li>
      </ol>
    </div>
  );
};

export default PageTitle;

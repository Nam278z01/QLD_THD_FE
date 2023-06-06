const ErrorNoSettingBU = () => {
  const body = document.querySelector("body");
  body.setAttribute("data-primary", "color_1");

  return (
    <div className="authincation h-100 p-meddle">
      <div className="container h-100">
        <div className="row justify-content-center h-100 align-items-center ">
          <div className="col-md-5">
            <div className="form-input-content text-center error-page">
              <h1 className="error-text font-weight-bold">404</h1>
              <h4>
                <i className="fa fa-exclamation-triangle text-warning" />
                The page you were looking hasn't been set up yet.
              </h4>
              <p>Setting hasn't been set up.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorNoSettingBU;

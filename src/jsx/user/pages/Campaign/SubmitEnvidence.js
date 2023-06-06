import * as React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { UpdateEvidence } from "../../../../services/CampaignAPI";
import { useMsal } from "@azure/msal-react";
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { scopes } from "../../../../dataConfig";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
const theInputBanner = document.querySelector("#ImageURLText");

const SubmitEnvidence = (id) => {
  const { instance, inProgress, accounts } = useMsal();
  const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
  const WalletInfoschema = Yup.object().shape({
    LinkRefer: Yup.string()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Enter correct url!"
      )
      .nullable(true),
    Description: Yup.string(),
    ImageURLText: Yup.mixed().test("fileSize", "The file is too large", () => {
      if (theInputBanner === null || theInputBanner.files[0] === undefined) {
        return true;
      }
      return theInputBanner.files[0].size <= 3145728;
    }),
  });

  const getToken = (api, ...body) => {
    if (inProgress === InteractionStatus.None) {
      const accessTokenRequest = {
        scopes: scopes,
        account: accounts[0],
      };
      instance
        .acquireTokenSilent(accessTokenRequest)
        .then((accessTokenResponse) => {
          // Acquire token silent success
          let accessToken = accessTokenResponse.accessToken;
          let token = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };

          // Call your API with token
          api(token, DepartmentID, ...body)
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: " Success",
              });
            })
            .catch(function (error) {
              Swal.fire({
                icon: "error",
                title: error,
              });
              // Acquire token interactive failure
            });
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance
              .acquireTokenPopup(accessTokenRequest)
              .then(function (accessTokenResponse) {
                // Acquire token interactive success
                let accessToken = accessTokenResponse.accessToken;
                let token = {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                };

                api(token, DepartmentID, ...body).then((res) => {
                  Swal.fire({
                    icon: "success",
                    title: "Success",
                  });
                });
              })
              .catch(function (error) {
                Swal.fire({
                  icon: "error",
                  title: error,
                });
                // Acquire token interactive failure
              });
          } else {
            Swal.fire({
              icon: "error",
              title: error,
            });
          }
        });
    }
  };

  const submitevidence = (body) => {
    getToken(UpdateEvidence, id, body);
  };

  return (
    <Formik
      initialValues={{
        Evidence: "",
        Description: "",
      }}
      validationSchema={WalletInfoschema}
      validator={() => ({})}
      onSubmit={(values, { setSubmitting }) => {
        submitevidence(values);
        setSubmitting(false);
      }}
    >
      {({
        values,
        errors,
        handleChange,
        handleBlur,
        isSubmitting,
        handleSubmit,
        touched,
      }) => (
        <form
          className="w-100"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <div className=" d-flex flex-column">
            <div className="d-flex flex-row m-4"></div>

            <div className=" d-flex flex-column border px-4">
              <div className=" row py-2">
                {/* <div className="col-6 my-2">
                  <h6 className="tex-dark">Select Envidence:</h6>
                  <Box className="col-8">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label"></InputLabel>
                      <Select
                        // labelId="demo-simple-select-label"
                        // label="Envidence"
                        id="demo-simple-select"
                        value={Envidence}
                        onChange={handleChange}
                      >
                        {EnvidenceList.map((e) => (
                          <MenuItem value={e.Id}>{e.Data}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div> */}
                <div className="col-6 my-2" style={{ height: 120 }}>
                  {!values.ImageURLText && (
                    <div
                      className={`form-group mb-3 row ${
                        values.LinkRefer
                          ? errors.LinkRefer
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-4 form-label"
                        htmlFor="LinkRefer"
                      >
                        Link Refer
                      </label>
                      <div className="col-lg-6">
                        <input
                          className="form-control m-0"
                          id="LinkRefer"
                          name="Evidence"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.LinkRefer}
                          type="text"
                        />

                        <div
                          id="LinkRefer-error"
                          className="invalid-feedback animated fadeInUp ms-3"
                          style={{ display: "block" }}
                        >
                          {errors.LinkRefer &&
                            touched.LinkRefer &&
                            errors.LinkRefer}
                        </div>
                      </div>
                    </div>
                  )}

                  {!values.Evidence && (
                    <div
                      className={`form-group mb-3 row ${
                        values.ImageURLText
                          ? errors.ImageURLText
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      <label
                        className="col-lg-4 form-label"
                        htmlFor="ImageURLText"
                      >
                        Image
                      </label>
                      <div className="col-lg-6">
                        <input
                          className="form-control m-0"
                          id="ImageURLText"
                          name="Evidence"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.LinkRefer}
                          type="file"
                          accept="image/jpeg, image/png"
                        />
                        <div
                          id="category-error"
                          className="invalid-feedback animated fadeInUp ms-3"
                          style={{ display: "block" }}
                        >
                          {errors.ImageURLText &&
                            touched.ImageURLText &&
                            errors.ImageURLText}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`form-group mb-3 row ${
                  values.Description
                    ? errors.Description
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
              >
                <label className=" form-label">Description</label>
                <div>
                  <textarea
                    className="form-control w-50"
                    id="Description"
                    name="Description"
                    rows="3"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  ></textarea>
                  <div
                    id="Description-error"
                    className="invalid-feedback animated fadeInUp ms-3"
                    style={{ display: "block" }}
                  >
                    {errors.Description &&
                      touched.Description &&
                      errors.Description}
                  </div>
                </div>
              </div>
              <div className="col-6 m-4">
                <button
                  type="submit"
                  onClick={(e) => {
                    e.target.blur();
                  }}
                  className="btn btn-primary"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};
export default SubmitEnvidence;

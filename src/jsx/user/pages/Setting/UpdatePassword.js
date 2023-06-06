import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useContext } from "react";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { updatePersonalShop } from "../../../../services/ShopAPI";
import { getProductDetail } from "../../../../services/ShopAPI";
import { useParams } from "react-router-dom";
import Loading from "../../../sharedPage/pages/Loading";
import { imgServer } from "../../../../dataConfig";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useEffect } from "react";
const UpdatePassword = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { getTokenFormData } = useContext(GetTokenContext);
  const [preview, setPreview] = useState(null);
  const [updateMode, setUpdateMode] = useState(false);
  const navigate = useHistory();
  const theInputBanner = document.querySelector("#ImageURLText");
  const { ID } = useParams();
  const [imgChange, setImgChange] = useState(false);
  const [passwordShown, setShown] = useState(false);
  const [deadImg, setDead] = useState(false);
  const [Shop] = useRefreshToken(getProductDetail, ID);
  const { account, userDepartmentID } = useSelector((state) => state.UserSlice);

  const valiSchema = Yup.object().shape({
    Name: Yup.string()
      .trim()
      .typeError("Please enter Name")
      .required("Please enter Name"),

    Description: Yup.string().trim().typeError("Please enter Description"),
    Quantity: Yup.number()
      .min(1)
      .integer()
      .typeError("Please enter positive integer number")
      .required("Please enter positive integer number"),
    Price: Yup.number()
      .min(1)
      .typeError("Please enter positive integer number")
      .required("Please enter positive integer number"),

    ImageURLText: Yup.mixed()
      .test("fileSize", "The file is too large", () => {
        if (!imgChange) return true;

        if (theInputBanner === null || theInputBanner.files[0] === undefined) {
          return true;
        }
        return theInputBanner.files[0].size <= 3145728;
      })
      .required("Image is required"),
  });
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  function UpdateProductFunc(body) {
    const { Name, Description, Quantity, Price } = body;
    let dataToSend;
    const formData = new FormData();
    const theInputBanner = document.querySelector("#ImageURLText");
    if (theInputBanner && theInputBanner.files[0]) {
      formData.append("Image", theInputBanner.files[0]);
    }
    formData.append("Name", Name);
    formData.append("Description", Description);
    formData.append("Quantity", Quantity);
    formData.append("Coin", Price);
    formData.append("Contact", account + "@fsoft.com.vn");
    dataToSend = formData;

    function success() {
      navigate.push("/shop");
      setUpdateMode(false);
    }
    getTokenFormData(
      updatePersonalShop,
      "Updated success",
      success,
      false,
      ID,
      dataToSend
    );
  }
  return Shop === null ? (
    <Loading />
  ) : (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Update Product</h4>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <Formik
                initialValues={{
                  Name: Shop.Name,
                  Quantity: Shop.Quantity,
                  Price: Shop.Coin,
                  ImageURLText: Shop.Image,
                  Description: Shop.Description,
                }}
                validationSchema={valiSchema}
                validator={() => ({})}
                onSubmit={(values, { setSubmitting }) => {
                  UpdateProductFunc(values);
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
                  resetForm,
                }) => (
                  <form
                    className="form-valide"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit(e);
                    }}
                  >
                    <div className="row">
                      <div className="col-xl-6">
                        <div
                          className={`form-group mb-3 row ${
                            values.Name
                              ? errors.Name
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label className="col-lg-4 form-label" htmlFor="Name">
                            Name Product<span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              id="Name"
                              className={`form-control m-0 ${
                                !updateMode && "pe-none"
                              }`}
                              readOnly={!updateMode}
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              value={values.Name}
                            />
                            <div
                              id="Name-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Name && touched.Name && errors.Name}
                            </div>

                            <div
                              id="times-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            />
                          </div>
                        </div>

                        <div
                          className={`form-group mb-3 row ${
                            values.Price
                              ? errors.Price
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="Price"
                          >
                            Price<span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="number"
                              className={`form-control  m-0 ${
                                !updateMode && "pe-none"
                              }`}
                              readOnly={!updateMode}
                              id="Price"
                              name="Price"
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              value={values.Price}
                            />
                            <div
                              id="Price-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Price && touched.Price && errors.Price}
                            </div>

                            <div
                              id="times-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            />
                          </div>
                        </div>
                        <div
                          className={`form-group mb-3 row ${
                            values.Quantity
                              ? errors.Quantity
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="Quantity"
                          >
                            Quantity<span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="number"
                              className={`form-control  m-0 ${
                                !updateMode && "pe-none"
                              }`}
                              readOnly={!updateMode}
                              id="Quantity"
                              name="Quantity"
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              value={values.Quantity}
                            />
                            <div
                              id="Quantity-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Quantity &&
                                touched.Quantity &&
                                errors.Quantity}
                            </div>

                            <div
                              id="times-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-6">
                        <div
                          className={`form-group mb-3 row ${
                            values.Description
                              ? errors.Description
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                          }`}
                        >
                          <label
                            className="col-lg-4 form-label"
                            htmlFor="Description"
                          >
                            Description
                          </label>
                          <div className="col-lg-6">
                            <textarea
                              type="text"
                              className={`form-control m-0 ${
                                !updateMode && "pe-none"
                              }`}
                              readOnly={!updateMode}
                              rows="3"
                              id="Description"
                              name="Description"
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              value={values.Description}
                            />
                            <div
                              id="Description-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.Description &&
                                touched.Description &&
                                errors.Description}
                            </div>

                            <div
                              id="times-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            />
                          </div>
                        </div>

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
                            {imgChange && selectedFile && (
                              <div className="d-inline-block  position-relative">
                                <div
                                  className="position-absolute top-0 start-100 translate-middle"
                                  style={{ zIndex: 10 }}
                                >
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="rounded-circle"
                                    onClick={() => {
                                      const theInputBanner =
                                        document.querySelector("#ImageURLText");

                                      theInputBanner.value = null;
                                      values.Image = null;
                                      theInputBanner.files = null;
                                      setSelectedFile(false);
                                    }}
                                  >
                                    <i className="fas fa-x" />
                                  </Button>
                                </div>
                                <img
                                  src={preview}
                                  height={60}
                                  className=" mb-3"
                                />
                              </div>
                            )}

                            {imgChange && (
                              <input
                                className={`form-control m-0 ${
                                  selectedFile && "d-none"
                                }`}
                                id="ImageURLText"
                                name="ImageURLText"
                                onChange={(e) => {
                                  handleChange(e);
                                  onSelectFile(e);
                                }}
                                onBlur={handleBlur}
                                type="file"
                              />
                            )}

                            {!imgChange && (
                              <div className="d-inline-block  position-relative pt-2">
                                {updateMode && (
                                  <div
                                    className="position-absolute top-0 start-100 translate-middle"
                                    style={{ zIndex: 10 }}
                                  >
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="rounded-circle"
                                      onClick={() => {
                                        values.Image = null;
                                        setImgChange(true);
                                      }}
                                    >
                                      <i className="fas fa-x" />
                                    </Button>
                                  </div>
                                )}
                                {deadImg ? (
                                  <span className="">No Image</span>
                                ) : (
                                  <img
                                    src={`${imgServer}${Shop.Image}`}
                                    height={60}
                                    className=" mt-3"
                                    onError={(e) => {
                                      setDead(true);
                                    }}
                                  />
                                )}
                              </div>
                            )}
                            <div
                              id="ImageURLText-error"
                              className="invalid-feedback animated fadeInUp ms-3"
                              style={{ display: "block" }}
                            >
                              {errors.ImageURLText &&
                                touched.ImageURLText &&
                                errors.ImageURLText}
                            </div>
                          </div>
                        </div>

                        <div className="form-group mb-3 row">
                          <div className="col-lg-4"></div>
                          <div className=" col-lg-6">
                            <div className="row">
                              {updateMode ? (
                                <>
                                  <div className="col-3">
                                    <button
                                      type="submit"
                                      className=" btn btn-primary me-1"
                                      onClick={(e) => {
                                        e.target.blur();
                                      }}
                                      disabled={isSubmitting}
                                    >
                                      Save
                                    </button>
                                  </div>
                                  <div className="col-9 text-start">
                                    <button
                                      type="reset"
                                      className="btn btn-secondary"
                                      onClick={(e) => {
                                        e.target.blur();
                                        setUpdateMode(false);
                                        resetForm({
                                          Name: Shop.Name,
                                          Quantity: Shop.Quantity,
                                          Price: Shop.Coin,
                                          ImageURLText: Shop.Image,
                                          Description: Shop.Description,
                                        });
                                        setImgChange(false);
                                        setSelectedFile(null);
                                        setPreview(null);
                                        setShown(false);
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <div className="col-6">
                                  <button
                                    type="button"
                                    className=" btn btn-primary"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.target.blur();
                                      setUpdateMode(true);
                                      setShown(true);
                                      setImgChange(deadImg);
                                    }}
                                  >
                                    Edit
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpdatePassword;

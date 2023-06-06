import { GetTokenContext } from "../../../../context/GetTokenContext";
import { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { createProduct } from "../../../../services/ShopAPI";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";

const CreateProduct = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [deadImg, setDead] = useState(true);
  const [preview, setPreview] = useState(null);
  const [imgChange, setImgChange] = useState(true);

  const { getTokenFormData } = useContext(GetTokenContext);
  const navigate = useHistory();
  const theInputBanner = document.querySelector("#ImageURLText");
  const { account, userDepartmentID } = useSelector((state) => state.UserSlice);
  const valiSchema = Yup.object().shape({
    Name: Yup.string()
      .trim()
      .max(250)
      .typeError("Please enter Name")
      .required("Please enter Name"),

    Description: Yup.string().trim().typeError("Please enter Description"),
    Quantity: Yup.number()
      .min(1)
      .max(50000)

      .integer()
      .typeError("Please enter Quantity")
      .required("Please enter Quantity"),
    Price: Yup.number()
      .min(1)
      .max(50000)
      .typeError("Please enter Price")
      .required("Please enter Price"),
    ImageURLText: Yup.mixed()
      .test("fileSize", "The file is too large", () => {
        if (theInputBanner === null || theInputBanner.files[0] === undefined) {
          return true;
        }
        return theInputBanner.files[0].size <= 3145728;
      })
      .required("Please enter Image"),
  });
  const setselected = () => {
    setselect(document.getElementById("RequestType").value);
  };
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    const maxAllowedSize = 200000;
    if (e.target.files[0].size > maxAllowedSize) {
      document.getElementById("fileSizeAlert").style.display = "block";
      e.target.value = null;
    }
    // I've kept this example simple by using the first image instead of multiple
    else {
      document.getElementById("fileSizeAlert").style.display = "none";
      setSelectedFile(e.target.files[0]);
    }
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
  function createProductFunc(body) {
    const { Name, Description, Quantity, Price } = body;
    let dataToSend;
    const theInputBanner = document.querySelector("#ImageURLText");
    if (theInputBanner !== null && theInputBanner.files[0]) {
      const formData = new FormData();
      formData.append("Name", Name);
      formData.append("Image", theInputBanner.files[0]);
      formData.append("Description", Description);
      formData.append("Quantity", Quantity);
      formData.append("Coin", Price);
      formData.append("Contact", account + "@fsoft.com.vn");
      formData.append("DepartmentID", userDepartmentID);
      dataToSend = formData;
    }
    function success() {
      navigate.push("/shop");
    }
    getTokenFormData(
      createProduct,
      "Product created",
      success,
      false,
      dataToSend
    );
  }
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Create Product</h4>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <Formik
                initialValues={{
                  Name: "",
                  Quantity: "",
                  Price: "",
                  ImageURLText: "",
                  Description: "",
                }}
                validationSchema={valiSchema}
                validator={() => ({})}
                onSubmit={(values, { setSubmitting }) => {
                  if (document.getElementById("ImageURLText").value) {
                    createProductFunc(values);
                    setSubmitting(true);
                  } else setSubmitting(false);
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
                              className="form-control m-0"
                              id="Name"
                              name="Name"
                              maxLength={250}
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onClick={(e) => {}}
                              onBlur={handleBlur}
                              value={values.Name}
                            />
                            {document.getElementById("Name") !== null &&
                              (document.getElementById("Name").value.length ==
                              250 ? (
                                <div style={{ color: "red" }}>
                                  Product Name have the max length is 250
                                </div>
                              ) : (
                                ""
                              ))}
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
                              className="form-control m-0"
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
                              className="form-control m-0"
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
                              className="form-control m-0"
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
                            Image<span className="text-danger">*</span>
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
                                      values.ImageURLText = null;
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
                                accept=".png, .jpg, .jpeg"
                              />
                            )}
                            <div
                              id="fileSizeAlert"
                              style={{ color: "red", display: "none" }}
                            >
                              Please choose the file that have size smaller than
                              200kb
                            </div>
                            {!imgChange && (
                              <div className="d-inline-block  position-relative pt-2">
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

                                <>
                                  <div
                                    id="ImageURLText-error"
                                    className="invalid-feedback animated fadeInUp ms-3"
                                    style={{ display: "block" }}
                                    onError={(e) => {
                                      setDead(true);
                                    }}
                                  >
                                    {errors.ImageURLText && errors.ImageURLText}
                                  </div>
                                </>
                              </div>
                            )}
                            <div
                              id="name-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {errors.ImageURLText && errors.ImageURLText}
                            </div>
                          </div>
                        </div>

                        <div className="form-group mb-3 row">
                          <div className="col-lg-4"></div>
                          <div className="col-lg-6">
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={isSubmitting}
                              onClick={(e) => {
                                e.target.blur();
                              }}
                            >
                              Submit
                            </button>
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
export default CreateProduct;

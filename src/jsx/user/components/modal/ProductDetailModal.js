import { Button } from "react-bootstrap";
import Loading from "../../../sharedPage/pages/Loading";
import CustomModalUtil from "../Shared/CustomModalUtil";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import * as Yup from "yup";
import { Formik } from "formik";
import { imgServer } from "../../../../dataConfig";
export default function ProductDetailModal({ show, setShow, data }) {
  const navigate = useHistory();
  const [first, setFirst] = useState(true);
  const { userID, role } = useSelector((state) => state.UserSlice);
  const [price, setPrice] = useState(true);
  const [defaulthref, setDefaulthref] = useState(
    "https://teams.microsoft.com/l/chat/0/0?users="
  );
  useEffect(() => {
    if (data && first) {
      setDefaulthref(defaulthref + data.Contact.split(",")[1]);
      setFirst(false);
      setPrice(data.Coin);
    } else {
      setPrice(data.Coin);
    }
  }, [data]);
  const handleChange1 = (e) => {
    setPrice(
      parseInt(document.getElementById("Quantity").value, 10) * data.Coin
    );
  };

  const valiSchema = Yup.object().shape({
    Quantity: Yup.number()
      .integer()
      .typeError("Please enter integer quantity")
      .required("Please enter integer quantity"),
  });

  return data === null ? (
    <Loading />
  ) : (
    <CustomModalUtil centered show={show} setShow={setShow} size="xl">
      <Formik
        initialValues={{
          Quantity: 1,
          Price: price,
        }}
        validationSchema={valiSchema}
        validator={() => ({})}
        onSubmit={(values, { setSubmitting }) => {
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
            className="form-valide"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <div className="row m-2">
              <div className="col col-6 ">
                <div className="text-center ">
                  <img
                    className="img-fluid"
                    src={`${imgServer}${data.Image}`}
                    alt=""
                  />
                </div>
              </div>
              <div className="col-6 col">
                <div className="d-flex flex-column my-2 text-center">
                  {" "}
                  <h2>{data.Name}</h2>
                </div>
                <div className="row">
                  <div className="col-4 m-0 p-0">
                    <h5>Seller:</h5>
                    <h5>Publish Date:</h5>
                    <h5>Price:</h5>
                    <h5>Quantity:</h5>
                    <h5>Phone:</h5>
                    <h5> Microsoft Teams:</h5>
                    <h5>Description:</h5>
                  </div>
                  <div className="col-8  m-0 p-0">
                    <h5 className="fw-normal">{data.UserMasterName}</h5>
                    <h5 className="fw-normal">
                      {moment(data.CreatedDate).format("YYYY-MM-DD")}{" "}
                      <i className="fa-solid fa-calendar-days"></i>
                    </h5>
                    <h5 className="text-danger">
                      {" "}
                      {price} <i className="fas fa-sack-dollar" />{" "}
                    </h5>
                    <h5>
                      <input
                        type="number"
                        className=" m-0"
                        id="Quantity"
                        name="Quantity"
                        onChange={(e) => {
                          handleChange1(e);
                        }}
                        onBlur={handleBlur}
                        defaultValue={values.Quantity}
                      />
                      <div
                        id="Quantity-error"
                        className="invalid-feedback animated fadeInUp ms-3"
                        style={{ display: "block" }}
                      >
                        {errors.Quantity && touched.Quantity && errors.Quantity}
                      </div>
                    </h5>
                    <h5>
                      {data.Contact === null
                        ? "No Data"
                        : data.Contact.split(",")[0]}
                    </h5>
                    <a href={defaulthref} target="_blank">
                      {data.Contact === null ? "" : data.Contact.split(",")[1]}
                    </a>
                    <h5 className="fw-normal">{data.Description}</h5>
                  </div>
                </div>
                <div className="text-center">
                  {data.UserMasterID === userID ? (
                    <>
                      <div>
                        <Button
                          variant="primary"
                          onClick={() => {
                            navigate.push(`/update-shop/${data.ID}`);
                          }}
                        >
                          Update
                        </Button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-warning"
                      style={{ width: "25%" }}
                      // onClick={() => {
                      //   navigate.push(`/wallet`);
                      // }}
                    >
                      Transfer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </CustomModalUtil>
  );
}

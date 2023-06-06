import { Button } from "react-bootstrap";
import Loading from "../../../sharedPage/pages/Loading";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import moment from "moment";
import * as Yup from "yup";
import { Formik } from "formik";
import { imgServer } from "../../../../dataConfig";
import { getProductDetail } from "../../../../services/ShopAPI";
import WalletTransfer from "../Wallet/Transfer";
import { getOneUserMasterByAccount } from "../../../../services/UsermasterAPI";
import { set } from "date-fns";

const ProductDetail = () => {
  const [totalQuantity, settotalQuantity] = useState(true);
  const navigate = useHistory();
  const [first, setFirst] = useState(true);
  const [Show, setShow] = useState(false);
  const onBlurtransfer = true;
  const [Transfer, setTransfer] = useState(false);
  const { account, userID, userDepartmentCode, displayName } = useSelector(
    (state) => state.UserSlice
  );
  const { ID } = useParams();
  const [price, setPrice] = useState(true);
  const { CoinName } = useSelector((a) => a.DepartmentSettingSlice);

  const [defaulthref, setDefaulthref] = useState(
    "https://teams.microsoft.com/l/chat/0/0?users="
  );
  const imgs = document.querySelectorAll(".img-select a");

  const imgBtns = [...imgs];
  const [data, setRefresh] = useRefreshToken(getProductDetail, ID);
  const [User, setRefreshUser] = useRefreshToken(
    getOneUserMasterByAccount,
    account
  );
  let imgId = 1;
  const [TotalCoin, setTotalCoin] = useState(0);
  useEffect(() => {
    if (data && first) {
      setFirst(false);
      setRefresh(true);
    } else if (data) {
      settotalQuantity(data.Quantity);
    }
  }, [data]);

  useEffect(() => {
    if (User !== null)
      if (User.TotalCoin !== null) setTotalCoin(User.TotalCoin);
  }, [User]);
  imgBtns.forEach((imgItem) => {
    imgItem.addEventListener("click", (event) => {
      event.preventDefault();

      imgId = imgItem.dataset.id;

      slideImage();
    });
  });

  function slideImage() {
    const displayWidth = document.querySelector(
      ".img-showcase img:first-child"
    ).clientWidth;

    document.querySelector(".img-showcase").style.transform = `translateX(${
      -(imgId - 1) * displayWidth
    }px)`;
  }

  window.addEventListener("resize", slideImage);
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    if (data !== null) setTotalPrice(data.Coin);
  }, [data]);

  const valiSchema = Yup.object().shape({
    Quantity: Yup.number()
      .min(1, "Please enter positive integer number equal or more than 1")
      .max(totalQuantity, "Not enough items, total quantity " + totalQuantity)
      .integer()
      .typeError("Please enter positive integer number")
      .required("Please enter positive integer number"),
  });

  return data === null ? (
    <Loading />
  ) : (
    <div>
      {!Show && (
        <Formik
          initialValues={{
            ID: data.ID,
            Quantity: 1,
            Account: data.UserMaster.Account,
            Price: data.Coin,
            UserMasterID: data.UserMaster.ID,
            TransactionMethod: 2,
            ProductName: data.Name,
          }}
          validationSchema={valiSchema}
          validator={() => ({})}
          onSubmit={(values, { setSubmitting }) => {
            if (TotalCoin > totalPrice) {
              setTransfer(values);
              setSubmitting(false);
              setShow(true);
            } else {
              document.getElementById("Quantity-error").innerHTML =
                "Don't have enough coins";
            }
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
              <div className="border rounded-2">
                <div className="row">
                  <div
                    className=" col-md-6 pe-0 ps-4 pb-3"
                    style={{ height: "auto" }}
                  >
                    <div
                      className="img-display"
                      style={{ paddingTop: "1.5%", paddingRight: "1%" }}
                    >
                      <div className="img-showcase">
                        <img
                          className="img"
                          src={`${imgServer}${data.Image}`}
                          alt="shoe image"
                        />

                        {/* <img class="img" src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWoNHlofGR8j7GYbtGgKC84azv1iB7criG_g&usqp=CAU" alt = "shoe image"/>

        <img class="img" src = "https://vcdn1-dulich.vnecdn.net/2020/09/04/1-Meo-chup-anh-dep-khi-di-bien-9310-1599219010.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=Np5bCzNWXseCGRww53JNhA" alt = "shoe image"/>

        <img class="img" src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_d9sP-VgLMvWBU7iC1qekUxpGX6uFzeZxEyDCGcIIFe-9c0YeSFmtQg7yQNglXuBmf6w&usqp=CAU" alt = "shoe image"/> */}
                      </div>
                    </div>

                    {/* <div class = "img-select">

      <div class = "img-item">

        <a href = "#" data-id = "1">

          <img class="img" src = "https://bold.vn/wp-content/uploads/2019/05/bold-academy-5.jpg" alt = "shoe image"/>

        </a>

      </div>

      <div class = "img-item">

        <a href = "#" data-id = "2">

          <img class="img" src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWoNHlofGR8j7GYbtGgKC84azv1iB7criG_g&usqp=CAU" alt = "shoe image"/>

        </a>

      </div>

      <div class = "img-item">

        <a href = "#" data-id = "3">

          <img class="img" src = "https://vcdn1-dulich.vnecdn.net/2020/09/04/1-Meo-chup-anh-dep-khi-di-bien-9310-1599219010.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=Np5bCzNWXseCGRww53JNhA" alt = "shoe image"/>

        </a>

      </div>

      <div class = "img-item">

        <a href = "#" data-id = "4">

          <img class="img" src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_d9sP-VgLMvWBU7iC1qekUxpGX6uFzeZxEyDCGcIIFe-9c0YeSFmtQg7yQNglXuBmf6w&usqp=CAU" alt = "shoe image"/>

        </a>

      </div>

    </div> */}
                  </div>

                  <div
                    className="col-md-6 border-start product-content pt-3 pb-0"
                    style={{ maxHeight: "100%" }}
                  >
                    <h1 className="text-center fw-bold text-decoration-underline">
                      {data.Name}
                    </h1>

                    <div className=" row product-detail pt-5">
                      <div className="col-6">
                        <ul style={{ paddingLeft: "0px" }}>
                          <li>
                            Seller: <span>{data.UserMaster.Account}</span>
                          </li>
                          <li>
                            Price:{" "}
                            <span className=" text-warning">
                              {" "}
                              {data.Coin} <span>{CoinName}</span>
                            </span>
                          </li>

                          <li>
                            Total Quantity:{" "}
                            {data.Quantity ? (
                              <span>{data.Quantity}</span>
                            ) : (
                              <span className="badge bg-danger">
                                Out of stock
                              </span>
                            )}
                          </li>

                          <li>
                            Publish Date:{" "}
                            <span>
                              {moment(data.CreatedDate).format("YYYY-MM-DD")}{" "}
                              <i className="fa-solid fa-calendar-days"></i>
                            </span>
                          </li>

                          <li>
                            Contact:{" "}
                            <a
                              href={defaulthref + data.Contact}
                              target="_blank"
                            >
                              <button
                                type="button"
                                style={{ backgroundColor: "blueviolet" }}
                                className="btn btn-primary"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  fill="currentColor"
                                  className="bi bi-microsoft-teams"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M9.186 4.797a2.42 2.42 0 1 0-2.86-2.448h1.178c.929 0 1.682.753 1.682 1.682v.766Zm-4.295 7.738h2.613c.929 0 1.682-.753 1.682-1.682V5.58h2.783a.7.7 0 0 1 .682.716v4.294a4.197 4.197 0 0 1-4.093 4.293c-1.618-.04-3-.99-3.667-2.35Zm10.737-9.372a1.674 1.674 0 1 1-3.349 0 1.674 1.674 0 0 1 3.349 0Zm-2.238 9.488c-.04 0-.08 0-.12-.002a5.19 5.19 0 0 0 .381-2.07V6.306a1.692 1.692 0 0 0-.15-.725h1.792c.39 0 .707.317.707.707v3.765a2.598 2.598 0 0 1-2.598 2.598h-.013Z"></path>
                                  <path d="M.682 3.349h6.822c.377 0 .682.305.682.682v6.822a.682.682 0 0 1-.682.682H.682A.682.682 0 0 1 0 10.853V4.03c0-.377.305-.682.682-.682Zm5.206 2.596v-.72h-3.59v.72h1.357V9.66h.87V5.945h1.363Z"></path>
                                </svg>
                              </button>
                            </a>
                          </li>
                        </ul>
                      </div>
                      {data.Description ? (
                        <div className="col-6">
                          <h3>About this item </h3>
                          <p>{data.Description}</p>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="purchase-info p-0 m-0">
                      <h5 className="">
                        Total Price:{" "}
                        <span className=" text-warning">
                          {" "}
                          {totalPrice} <span>{CoinName}</span>
                        </span>
                      </h5>
                      <div>
                        <span>Quantity: </span>
                        <input
                          type="number"
                          className=" m-0"
                          id="Quantity"
                          name="Quantity"
                           min={1}
                           max={totalQuantity}
                           
                          style={{ width: "12%" }}
                          onChange={(e) => {
                            handleChange(e);
                            if(document.getElementById('Quantity').value>totalQuantity||document.getElementById('Quantity').value<0){
                  
                              document.getElementById('Quantity').value = 1;
                            }
                            setTotalPrice(e.target.value * data.Coin);
                          }}
                          onBlur={handleBlur}
                          defaultValue={values.Quantity}
                        />
                      </div>

                      <br />

                      <div
                        id="Quantity-error"
                        className="invalid-feedback animated fadeInUp ms-3"
                        style={{ display: "block" }}
                      >
                        {errors.Quantity && touched.Quantity && errors.Quantity}
                      </div>
                      {data.UserMasterID === userID ? (
                        <>
                          <div className="text-center">
                            <Button
                              variant="primary"
                              style={{ width: "25%", backgroundColor: "blue" }}
                              onClick={() => {
                                navigate.push(`/update-shop/${data.ID}`);
                              }}
                            >
                              Update
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <button
                            type="submit"
                            className="btn btn-primary "
                            style={{ width: "25%", backgroundColor: "blue" }}
                          >
                            Buy <i className="fas fa-shopping-cart"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Formik>
      )}
      {Show && (
        <WalletTransfer
          setShow={setShow}
          setRefresh={setRefresh}
          handleBlur1={onBlurtransfer}
          data={Transfer}
        />
      )}
    </div>
  );
};
export default ProductDetail;

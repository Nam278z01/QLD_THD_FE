import { Button, Tab, Nav } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import CardTitleWithSearch from "../../components/Card/CardTitleWithSearch";
import useQuery from "../../../../Hook/useQuery";
import useReplaceURL from "../../../../Hook/useReplaceURL";
import ShopTab from "../../components/ShopInfor/ShopTab";
import PersonalShopTab from "../../components/ShopInfor/PersonalShopTab";
import CustomPagination from "../../components/Shared/CustomPagination";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getShopList } from "../../../../services/ShopAPI";
import Loading from "../../../sharedPage/pages/Loading";
import { getPersonalShopList } from "../../../../services/ShopAPI";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
const Shop = () => {
  const query = useQuery();
  const { URLchange } = useReplaceURL(`/shop`);
  const searchQuery = query.get("search");
  const rowQuery = query.get("row") || 10;
  const pageQuery = query.get("page") || 1;
  const sortQuery = query.get("sort");
  const navigate = useHistory();
  const { userID } = useSelector((state) => state.UserSlice);
  const setRefresh = () => {
    setRefreshAllShop(new Date());
    setRefreshPersonalShop(new Date());
  };
  function pageChange(page) {
    URLchange(page, rowQuery, sortQuery, searchQuery);
  }
  function rowChange(row) {
    URLchange(1, row, sortQuery, searchQuery);
  }
  function searchHandleUtil(search) {
    URLchange(1, rowQuery, sortQuery, search);
  }
  const [ShopData, setRefreshAllShop] = useRefreshToken(
    getShopList,
    pageQuery,
    rowQuery,
    searchQuery
  );
  const [PersonalShopData, setRefreshPersonalShop] = useRefreshToken(
    getPersonalShopList,
    userID,
    pageQuery,
    rowQuery,
    searchQuery
  );

  const [pageNum, setPageNum] = useState(1);
  const [tab, setTab] = useState(false); /// state 0 tab shop state 1 tab personalShop

  if (ShopData != null)
    if (ShopData.totalPage == null || ShopData.totalPage == 0) {
      ShopData.totalPage = 1;
    }
  if (PersonalShopData != null)
    if (PersonalShopData.totalPage == null || PersonalShopData.totalPage == 0) {
      PersonalShopData.totalPage = 1;
    }
  const [test, setTest] = useState(1);
  useEffect(() => {
    if (ShopData != null && test == 1) {
      setPageNum(ShopData.totalPage);
    }
    if (PersonalShopData != null && test == 2) {
      setPageNum(PersonalShopData.totalPage);
    }
  }, [ShopData, PersonalShopData]);
  return ShopData === null || PersonalShopData === null ? (
    <Loading />
  ) : (
    <>
      <div className="d-flex flex-column">
        <div className="d-flex flex-row ">
          <h1 className="col-12 text-blue m-0 text-center text-align-center">
            Shop List{" "}
          </h1>
        </div>
        <div className="row">
          <div className="col-2 text-start mt-3 ">
            <Button
              onClick={(e) => {
                e.target.blur();
                navigate.push("/sell");
              }}
            >
              Sell <i className="fas fa-plus" />
            </Button>
          </div>
          <div className="col-10 text-start col">
            <CardTitleWithSearch
              searchHandle={searchHandleUtil}
              currentSearch={searchQuery}
            />
            <div className="row">
              <div className="col-9"></div>
              <div className="col-3 " hidden={tab}>
                <h5 className="d-flex justify-content-center text-danger">
                  <span hidden={ShopData.total === 0}>
                    Total {ShopData.total} product
                    <span hidden={ShopData.total === 1}>s</span>
                  </span>
                  <span hidden={ShopData.total !== 0}>No product</span>
                </h5>
              </div>
              <div className="col-3 " hidden={!tab}>
                <h5 className="d-flex justify-content-center text-danger">
                  <span hidden={PersonalShopData.total === 0}>
                    Total {PersonalShopData.total} product
                    <span hidden={PersonalShopData.total === 1}>s</span>
                  </span>
                  <span hidden={PersonalShopData.total !== 0}>No product</span>
                </h5>{" "}
              </div>
            </div>
          </div>
        </div>
        <Tab.Container defaultActiveKey={"Shop"}>
          <Nav as="ul" className="nav nav-tabs">
            <Nav.Item
              as="li"
              className="nav-item"
              onClick={() => {
                setPageNum(ShopData.totalPage);
                setTab(false);
                setTest(1);
              }}
            >
              <Nav.Link to="#shop" eventKey="Shop">
                Shop
              </Nav.Link>
            </Nav.Item>

            <Nav.Item
              as="li"
              className="nav-item"
              onClick={() => {
                setPageNum(PersonalShopData.totalPage);
                setTab(true);
                setTest(2);
              }}
            >
              <Nav.Link to="#personal" eventKey="Personal">
                My Shop
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane id="shop" eventKey="Shop">
              <ShopTab ShopData={ShopData} />
            </Tab.Pane>
            <Tab.Pane id="personal" eventKey="Personal">
              <PersonalShopTab
                ShopData={PersonalShopData}
                setRefresh={setRefresh}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        <div className="col-12 mt-2 ">
          <div className="card-footer  bg-transparent border-0 border">
            <CustomPagination
              overPage={null}
              noRowChange={null}
              page={null}
              pageChange={pageChange}
              totalPage={pageNum}
              rowChange={rowChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;

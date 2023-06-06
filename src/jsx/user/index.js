import React, { useContext } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import "./index.css";
import "./chart.css";
import "./step.css";
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrollToTop";
import CreateCampaign from "./pages/Campaign/CreateCampaign";
import Error400 from "../sharedPage/pages/Error400";
import Error403 from "../sharedPage/pages/Error403";
import Error404 from "../sharedPage/pages/Error404";
import Error500 from "../sharedPage/pages/Error500";
import Error503 from "../sharedPage/pages/Error503";
import CampaignListRemake from "./pages/Campaign/CampaignListRemake";
import { ThemeContext } from "../../context/ThemeContext";
import { useSelector } from "react-redux";
import RequestList from "./pages/Point/RequestList";
import MyRequestList from "./pages/Point/MyRequestList";
import RuleList from "./pages/Rule/RuleList";
import ProjectListALL from "./pages/Projects/ProjectListALL";
import PMMember from "./pages/PM/PMMember";
import AllMemberList from "./pages/BUL/AllMemberList";
import CampaignDetailPage from "./pages/Campaign/CampaignDetailPage";
import GroupDetailPage from "./pages/Group/GroupDetailPage";
import GroupList from "./pages/Group/GroupList";
import PageTitle from "./layouts/PageTitle";
import VotePage from "./pages/Vote/VotePage";
import WIP from "../sharedPage/pages/WIP";
import UpdateRule from "./pages/Rule/UpdateRule";
import UserProfile from "./pages/UserProfile";
import Setting2 from "./layouts/Setting";
import RequestUpdate from "./pages/Point/RequestUpdate";
import Leaderboard from "./pages/LeaderBoard";
import ProjectDetailPage from "./pages/Projects/ProjectDetailPage";
import NewRequestPage from "./pages/Point/NewRequestPage";
import NewRulePage from "./pages/Rule/NewRulePage";
import ManageBadgePage from "./pages/ManageBadge/ManageBadgePage";
import SettingBU from "./pages/Setting/SettingBU";
import ErrorNoSettingBU from "../sharedPage/pages/ErrorNoSettingBU";
import CampaignStats from "./pages/Campaign/CampaignStats";
import SubmitEnvidence from "./pages/Campaign/SubmitEnvidence";
import Wallet from "./pages/Wallet/Wallet";
import WalletHistory from "./pages/Wallet/WalletHistory";
import HistoryList from "./pages/Point/HistoryList";
import { GetTokenContextProvider } from "../../context/GetTokenContext";
import { ProSidebarProvider } from "react-pro-sidebar";
import NewProjectPage from "./pages/Projects/NewProjectPage";
import CreateGroup from "./pages/Group/CreateGroup";
import UpdateGroupCampaign from "./pages/Group/UpdateGroupCampaign";
import Shop from "./pages/Shop/Shop";
import Sell from "./pages/Shop/Sell";
import UpdateShop from "./pages/Shop/UpdateShop";
import ProductDetail from "./pages/Shop/ProductDetail";
import ShopHistory from "./pages/Shop/ShopHistory";
import NotificationList from "./pages/Notification/NotificationList";
import cloneCampaign from "./pages/Campaign/CloneCampaign";
import EditMoocCampaignRequest from "./pages/Point/EditMoocCampaignRequest";
import HistoryCampaignList from "./pages/Point/HistoryCampaignList ";
import EditCampaignRequest from "./pages/Point/EditCampaignRequest";
import UpdatePassword from "./pages/Setting/UpdatePassword";
import Sync from "./pages/Sync/Sync";
import UpdateProjectPage from "./pages/Projects/UpdateProjectPage ";
import CallData from "./pages/Point/Dashboard/callData";
import FormSyncAPI from "./pages/Sync/FormSyncAPI";
import Workingtime from "./pages/BUL/Workingtime";

const body = document.querySelector("body");

const NavigateTo = () => {
  const navigate = useHistory();

  // navigate.replace(
  //   `/leaderboard?year=${new Date().getFullYear()}&month=${
  //     new Date().getMonth() + 1
  //   }`
  // );
  navigate.replace(`/point/request`);

  return <div></div>;
};

const NavigateTo404 = () => {
  const navigate = useHistory();

  navigate.replace(`/page-error-404`);
  return <div></div>;
};

const UserIndex = () => {
  const { menuToggle } = useContext(ThemeContext);
  const { role, userID } = useSelector((state) => state.UserSlice);
  const { DefaultHead } = useSelector((a) => a.DepartmentSettingSlice);

  body.setAttribute("data-primary", "color_14");

  let routes = [
    /// leaderboard
    { url: "", component: NavigateTo },
    { url: "leaderboard", component: Leaderboard },
    { url: "page-WIP", component: WIP },
    /// pages
    { url: "page-error-400", component: Error400 },
    { url: "page-error-403", component: Error403 },
    { url: "page-error-404", component: Error404 },
    { url: "page-error-500", component: Error500 },
    { url: "page-error-503", component: Error503 },
  ];

  let normalRoute = [
    // / campaign
    { url: "campaign-list", component: CampaignListRemake },
    { url: "campaign-detail", component: CampaignDetailPage },
    { url: "campaign-detail/:ID", component: CampaignDetailPage },
    { url: "campaign-clone/:ID", component: cloneCampaign },
    { url: "campaign-stats/:account", component: CampaignStats },
    { url: "campaign-envidence/account/:ID", component: SubmitEnvidence },

    // { url: "campaign-list", component: WIP },
    // { url: "campaign-detail/:ID", component: WIP },

    /// Group
    { url: "group-list", component: GroupList },
    { url: "group-detail", component: GroupDetailPage },
    { url: "create-groupcampaign", component: CreateGroup },
    { url: "detail-groupcampaign/:ID", component: UpdateGroupCampaign },

    ///Notification
    { url: "notification-list", component: NotificationList },

    /// rule
    { url: "rule/rule-list", component: RuleList },
    { url: "formapi", component: FormSyncAPI },

    // wallet
    { url: "wallet/wallet-history/:account", component: WalletHistory },
    { url: "wallet", component: Wallet },
    { url: "shop", component: Shop },
    { url: "shop/shop-history/:account", component: ShopHistory },
    { url: "update-shop/:ID", component: UpdateShop },

    { url: "detail-product/:ID", component: ProductDetail },

    { url: "sell", component: Sell },
    ///setting
    { url: "update-password/", component: UpdatePassword },

    /// profile
    { url: "user-profile/:account", component: UserProfile },
    { url: "vote", component: VotePage },
    { url: "page-WIP", component: WIP },
    { url: "point/update/:ID", component: RequestUpdate },
    { url: "badge", component: ManageBadgePage },
    { url: "point/request", component: HistoryList },
    { url: "campaign/request", component: HistoryCampaignList },
    {
      url: "point/edit-campaign-request/:requestID",
      component: EditCampaignRequest,
    },
    {
      url: "point/edit-mooccampaign-request/:requestID",
      component: EditMoocCampaignRequest,
    },
  ];

  const Memroutes = [
    //member
    {
      url: "member/project-list",
      component: ProjectListALL,
    },
    {
      url: "member/project-detail/:ID",
      component: ProjectDetailPage,
    },

    //point
    // { url: "point/my-request", component: MyRequestList },
    { url: "point/new-request", component: NewRequestPage },
    // { url: "point/request-history", component: HistoryList },
  ];

  const PMroutes = [
    /// PM
    {
      url: "PM/project-list",
      component: ProjectListALL,
    },
    {
      url: "PM/project-detail/:ID",
      component: ProjectDetailPage,
    },

    { url: "PM/member-list", component: PMMember },

    //point
    { url: "point/request-list", component: RequestList },
    // { url: "point/my-request", component: MyRequestList },
    { url: "point/new-request", component: NewRequestPage },
    { url: "PM/working-time", component: Workingtime },

    // { url: "point/request-history", component: HistoryList },
  ];

  const BULroutes = [
    ///BUL
    {
      url: "Head/project-list",
      component: ProjectListALL,
    },
    {
      url: "Head/project-detail/:ID",
      component: ProjectDetailPage,
    },
    {
      url: "Head/create-project",
      component: NewProjectPage,
    },
    {
      url: "Head/update-project/:ID",
      component: UpdateProjectPage,
    },
    {
      url: "Head/all-member",
      component: AllMemberList,
    },
    { url: "Head/working-time", component: Workingtime },
    //dashboard
    { url: "dashboard", component: CallData },
    //point
    { url: "point/request-list", component: RequestList },
    // { url: "point/request-history", component: HistoryList },

    /// rule
    { url: "rule/new-rule", component: NewRulePage },
    { url: "rule/update/:id", component: UpdateRule },

    // campaign
    { url: "create-campaign", component: CreateCampaign },
    // { url: "create-campaign", component: WIP },
    //sync
    { url: "sync", component: Sync },
  ];

  if (DefaultHead.HeadID === userID) {
    routes.push({ url: "setting", component: SettingBU });
  }

  if (role === "PM") {
    routes.push(...normalRoute);
    routes.push(...PMroutes);
  } else if (role === "Head") {
    routes.push(...normalRoute);
    routes.push(...BULroutes);
  } else if (role === "Member") {
    routes.push(...normalRoute);
    routes.push(...Memroutes);
  }

  routes.push({ url: "*", component: NavigateTo404 });

  let path = useLocation().pathname;

  let pagePath = path.split("-").includes("/page");

  const noShowPageTitle = [`/leaderboard`, `/app-profile`];

  return (
    <ProSidebarProvider>
      <GetTokenContextProvider>
        <div
          id={`${!pagePath ? "main-wrapper" : ""}`}
          className={`${!pagePath ? "show" : "mh100vh"}  ${
            menuToggle ? "menu-toggle" : ""
          }`}
        >
          {!pagePath && <Nav />}

          <div
            className={`${!pagePath ? "content-body" : ""} ${
              role === "guest" ? "m-0" : ""
            } `}
            style={{ marginLeft: !pagePath ? "80px" : "" }}
          >
            <div
              className={`${!pagePath ? "container-fluid" : ""}`}
              style={{ minHeight: window.screen.height - 60 }}
            >
              {!noShowPageTitle.includes(path) && !pagePath && <PageTitle />}

              <Switch>
                {routes.map((data, i) => (
                  <Route
                    key={i}
                    exact
                    path={`/${data.url}`}
                    component={data.component}
                  />
                ))}
              </Switch>
            </div>
          </div>
          {/* <Setting2 /> */}
          {!pagePath && <Footer />}
        </div>
        <ScrollToTop />
      </GetTokenContextProvider>
    </ProSidebarProvider>
  );
};

export default UserIndex;

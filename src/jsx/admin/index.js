import React, { useContext } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import "./index.css";
import "./chart.css";
import "./step.css";
import ScrollToTop from "./layouts/ScrollToTop";
import Error400 from "../sharedPage/pages/Error400";
import Error403 from "../sharedPage/pages/Error403";
import Error404 from "../sharedPage/pages/Error404";
import Error500 from "../sharedPage/pages/Error500";
import Error503 from "../sharedPage/pages/Error503";
import AdminDashBoard from "./pages/AdminDashBoard";
import { ThemeContext } from "../../context/ThemeContext";
import Footer from "./layouts/Footer";
import Nav from "./layouts/nav";
import DepartmentDetailPage from "./pages/DepartmentDetailPage";
import PageTitle from "../user/layouts/PageTitle";
import { GetTokenContextProvider } from "../../context/GetTokenContext";

const body = document.querySelector("body");

const NavigateTo = () => {
  const navigate = useHistory();
  navigate.replace(`/dashboard`);

  return <div></div>;
};

const NavigateTo404 = () => {
  const navigate = useHistory();
  navigate.replace(`/page-error-404`);

  return <div></div>;
};

const AdminIndex = () => {
  const { menuToggle } = useContext(ThemeContext);

  body.setAttribute("data-primary", "color_14");

  let routes = [
    { url: "", component: NavigateTo },
    { url: "dashboard", component: AdminDashBoard },
    { url: "department/:departmentID", component: DepartmentDetailPage },

    /// pages
    { url: "page-error-400", component: Error400 },
    { url: "page-error-403", component: Error403 },
    { url: "page-error-404", component: Error404 },
    { url: "page-error-500", component: Error500 },
    { url: "page-error-503", component: Error503 },

    { url: "*", component: NavigateTo404 },
  ];

  let path = useLocation().pathname;
  let pagePath = path.split("-").includes("/page");

  const noPageTitle = ["/dashboard"];

  return (
    <>
      <GetTokenContextProvider>
        <div
          id={`${!pagePath ? "main-wrapper" : ""}`}
          className={`${!pagePath ? "show" : "mh100vh"}  ${
            menuToggle ? "menu-toggle" : ""
          }`}
        >
          {!pagePath && <Nav />}
          <div className={`${!pagePath ? "content-body" : ""} m-0`}>
            <div
              className={`${!pagePath ? "container-fluid" : ""}`}
              style={{ minHeight: window.screen.height - 60 }}
            >
              {!noPageTitle.includes(path) && !pagePath && <PageTitle />}
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
          <Footer />
        </div>
        <ScrollToTop />
      </GetTokenContextProvider>
    </>
  );
};

export default AdminIndex;

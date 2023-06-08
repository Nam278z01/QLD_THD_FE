import {
  AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate
} from "@azure/msal-react";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AppRouter from "./AppRouter";
import "./css/style.css";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import { store } from "./store/store";
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import { checkVersion } from "./utils/browser";
import CheckBrowserVersion from "./components/CheckBrowserVersion";
import HomePage from './pages/User/HomePage';

const antdThemeConfig = {
  token: {
    colorPrimary: '#735AD8',
    borderRadius: 16,
    colorBorder: '#D0D5DD',
    colorBorderSecondary: '#D0D5DD'
  },
}

const App = () => {
  const statusVersion = checkVersion();

  return (
    <Provider store={store}>
      <ConfigProvider theme={antdThemeConfig}>
            <BrowserRouter>
              <Switch>
                <Route exact path="/" component={Login} />
                {/* <Route exact path="/home" component={HomePage} /> */}
                <Route
                  exact
                  path="/page-error-404-no-setting"
                  component={() => <ErrorPage
                    title="The page you were looking for Not Have Setting Yet."
                    desc="Department Not Have Setting Yet."
                  />}
                />

                <Route
                  exact
                  path="/page-error-404"
                  component={() => <ErrorPage
                    title="The page you were looking for is not found!"
                    desc="You may have mistyped the address or the page may have moved."
                  />}
                />

                <Route
                  exact
                  path="/page-error-503"
                  component={() => <ErrorPage
                    title="Service Unavailable"
                    desc="Sorry, we are under maintenance!"
                  />}
                />

                <Route
                  exact
                  path="/page-error-403"
                  component={() => <ErrorPage
                    title="Forbidden Error!"
                    desc="You do not have permission to view this resource."
                  />}
                />
                <Route path="/:depaName" component={AppRouter} />
              </Switch>
            </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
};

export default App;

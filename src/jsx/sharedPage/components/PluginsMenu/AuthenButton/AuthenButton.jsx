import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { Button } from "react-bootstrap";
import { loginRequest } from "../../../../../authConfig";

export const AuthenButton = (props) => {
  const { instance } = useMsal();

  return (
    <>
      <AuthenticatedTemplate>
        <Button
          onClick={(e) => {
            instance.logoutRedirect({ postLogoutRedirectUri: "/" });
          }}
          size={props.size}
        >
          Sign out
        </Button>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Button
          onClick={() => {
            instance.loginRedirect(loginRequest);
          }}
          size={props.size}
        >
          Sign in
        </Button>
      </UnauthenticatedTemplate>
    </>
  );
};

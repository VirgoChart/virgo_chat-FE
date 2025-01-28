import LoginForm from "./LoginForm";
import { GoogleOAuthProvider } from "@react-oauth/google";

const Login = () => {
  return (
    <>
      <GoogleOAuthProvider clientId="808422189889-loiulqip064p4v6rjcb5lujcch70f6jo.apps.googleusercontent.com">
        <LoginForm />
      </GoogleOAuthProvider>
    </>
  );
};

export default Login;

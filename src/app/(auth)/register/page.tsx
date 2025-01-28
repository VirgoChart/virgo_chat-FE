import { GoogleOAuthProvider } from "@react-oauth/google";
import RegisterForm from "./RegisterForm";

const Login = () => {
  return (
    <>
      <GoogleOAuthProvider clientId="808422189889-loiulqip064p4v6rjcb5lujcch70f6jo.apps.googleusercontent.com">
        <RegisterForm />
      </GoogleOAuthProvider>
    </>
  );
};

export default Login;

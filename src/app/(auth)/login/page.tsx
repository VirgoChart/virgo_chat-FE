import FacebookScript from "@/app/FacebookScript";
import LoginForm from "./LoginForm";
import { GoogleOAuthProvider } from "@react-oauth/google";

const Login = () => {
  return (
    <div className="bg-white-500 rounded-lg">
      <FacebookScript />
      <GoogleOAuthProvider clientId="808422189889-loiulqip064p4v6rjcb5lujcch70f6jo.apps.googleusercontent.com">
        <LoginForm />
      </GoogleOAuthProvider>
    </div>
  );
};

export default Login;

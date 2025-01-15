import LoginForm from "./LoginForm";
const loginformbg = "@/images/loginformbg.webp";

const Login = () => {
  return (
    <div className="bg-white-500 p-4 rounded-lg">
      <div className="text-primary text-xl font-bold text-center">
        Chào mừng đến với HBChat
      </div>
      <div className="text-primary text-center my-2">Đăng nhập</div>

      <LoginForm />
    </div>
  );
};

export default Login;

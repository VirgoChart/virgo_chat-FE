import { ReactNode } from "react";
const loginBg = "/images/loginbg.jpeg";

const AuthLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <div
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
      className="w-screen h-screen flex justify-center items-center"
    >
      <div className="w-full sm:w-[430px] shadow-2xl p-4 rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

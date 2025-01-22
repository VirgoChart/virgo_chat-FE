import { ReactNode } from "react";
const loginBg = "/images/loginbg.jpeg";

const AuthLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full rounded-lg">{children}</div>
    </div>
  );
};

export default AuthLayout;

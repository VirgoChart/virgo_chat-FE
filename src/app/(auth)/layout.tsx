import { ReactNode } from "react";

const AuthLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full sm:w-[430px] shadow-2xl p-4 rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

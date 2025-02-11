import ResetPasswordForm from "./ResetPasswordForm";

const ResetPassword = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/images/bg-left.png')",
        backgroundSize: "cover",
      }}
      className="h-full flex-1 flex justify-center items-center"
    >
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;

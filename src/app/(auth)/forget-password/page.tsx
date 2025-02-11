import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/images/bg-left.png')",
        backgroundSize: "cover",
      }}
      className="h-full flex-1 flex justify-center items-center"
    >
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;

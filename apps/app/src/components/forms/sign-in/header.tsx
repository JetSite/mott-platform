export default function Header({ showOtpInput }: { showOtpInput: boolean }) {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">
        {showOtpInput ? "Enter Access Code" : "Your data, your way."}
      </h1>
      <h2
        className={`mb-6 ${showOtpInput ? "text-lg" : "text-2xl"} font-bold tracking-tight text-neutral-400`}
      >
        {showOtpInput
          ? "Enter the 6-digit code to confirm you received the text message."
          : "Create your Mott account"}
      </h2>
    </>
  );
}

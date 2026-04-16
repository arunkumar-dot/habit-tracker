import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        variables: {
          colorPrimary: "#C2410C",
          colorBackground: "#1A1614",
          colorInputBackground: "#231E1B",
          colorInputText: "#F5F1EA",
          colorText: "#F5F1EA",
          colorTextSecondary: "#C8C2B8",
          colorNeutral: "#3D3631",
          borderRadius: "0.75rem",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        elements: {
          card: {
            background: "#1A1614",
            border: "1px solid #3D3631",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          },
          headerTitle: { color: "#F5F1EA" },
          headerSubtitle: { color: "#C8C2B8" },
          formButtonPrimary: {
            background: "#C2410C",
            "&:hover": { background: "#9A3412" },
          },
          footerActionLink: { color: "#E86F3C" },
        },
      }}
    />
  );
}

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        variables: {
          colorPrimary: "#6366f1",
          colorBackground: "#12121a",
          colorInputBackground: "#1e1e2e",
          colorInputText: "#e2e8f0",
          colorText: "#e2e8f0",
          colorTextSecondary: "#94a3b8",
          colorNeutral: "#2a2a3e",
          borderRadius: "0.75rem",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        elements: {
          card: {
            background: "#12121a",
            border: "1px solid #2a2a3e",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          },
          headerTitle: {
            color: "#e2e8f0",
          },
          headerSubtitle: {
            color: "#94a3b8",
          },
          formButtonPrimary: {
            background: "#6366f1",
            "&:hover": { background: "#4f46e5" },
          },
          footerActionLink: {
            color: "#6366f1",
          },
        },
      }}
    />
  );
}

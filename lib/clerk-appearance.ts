/**
 * Shared Clerk appearance config for sign-in and sign-up pages.
 * Matches the app's warm-dark design tokens exactly.
 *
 * Type is inferred from SignIn/SignUp usage — no explicit import needed.
 */
export const clerkDarkAppearance = {
  variables: {
    colorPrimary:         "#E86F3C",
    colorBackground:      "#1A1614",
    colorInputBackground: "#14100E",
    colorInputText:       "#F5F1EA",
    colorText:            "#F5F1EA",
    colorTextSecondary:   "#C8C2B8",
    colorTextOnPrimaryBackground: "#ffffff",
    colorNeutral:         "#F5F1EA",
    colorDanger:          "#E05252",
    colorSuccess:         "#7BAF2E",
    borderRadius:         "0.625rem",
    fontFamily:           "var(--nf-sans, Inter, -apple-system, sans-serif)",
    fontSize:             "0.9375rem",
    spacingUnit:          "1rem",
  },
  elements: {
    // ── Card / root ────────────────────────────────────────────────────────
    card: {
      background:   "#231E1B",
      border:       "1px solid #3D3631",
      boxShadow:    "0 25px 50px rgba(0,0,0,0.5)",
      padding:      "2rem",
    },
    cardBox: {
      boxShadow: "none",
    },

    // ── Header ─────────────────────────────────────────────────────────────
    headerTitle: {
      color:      "#F5F1EA",
      fontWeight: "600",
      fontSize:   "1.25rem",
    },
    headerSubtitle: {
      color:    "#C8C2B8",
      fontSize: "0.875rem",
    },

    // ── Logo / avatar ──────────────────────────────────────────────────────
    logoBox: {
      justifyContent: "center",
    },

    // ── Social buttons ─────────────────────────────────────────────────────
    socialButtonsBlockButton: {
      background:   "#14100E",
      border:       "1px solid #3D3631",
      color:        "#F5F1EA",
    },
    socialButtonsBlockButtonText: {
      color: "#F5F1EA",
    },
    socialButtonsIconButton: {
      background: "#14100E",
      border:     "1px solid #3D3631",
    },

    // ── Divider ────────────────────────────────────────────────────────────
    dividerLine: {
      background: "#3D3631",
    },
    dividerText: {
      color: "#8A8680",
    },

    // ── Form labels ────────────────────────────────────────────────────────
    formFieldLabel: {
      color:      "#C8C2B8",
      fontSize:   "0.8125rem",
      fontWeight: "500",
    },
    formFieldLabelRow: {
      marginBottom: "0.375rem",
    },

    // ── Form inputs ────────────────────────────────────────────────────────
    // String value → Clerk adds this class directly to the <input> DOM node,
    // so our CSS can reach ::placeholder (impossible with object/inline styles).
    formFieldInput: "habit-clerk-input",
    formFieldInputShowPasswordButton: {
      color: "#8A8680",
    },

    // ── "Forgot password?" and other inline field actions ──────────────────
    formFieldAction: {
      color:    "#E86F3C",
      fontSize: "0.8125rem",
    },

    // ── Error / hint text ──────────────────────────────────────────────────
    formFieldErrorText: {
      color: "#E05252",
    },
    formFieldHintText: {
      color: "#8A8680",
    },

    // ── Primary submit button ──────────────────────────────────────────────
    formButtonPrimary: {
      background:    "#E86F3C",
      color:         "#ffffff",
      fontWeight:    "600",
      letterSpacing: "0.01em",
    },

    // ── Secondary / ghost buttons ──────────────────────────────────────────
    formButtonReset: {
      color: "#C8C2B8",
    },

    // ── "Use another method" block ─────────────────────────────────────────
    alternativeMethodsBlockButton: {
      background: "#14100E",
      border:     "1px solid #3D3631",
      color:      "#C8C2B8",
    },
    alternativeMethodsBlockButtonText: {
      color: "#C8C2B8",
    },

    // ── Identity preview (email shown on password step) ────────────────────
    identityPreviewText: {
      color: "#F5F1EA",
    },
    identityPreviewEditButton: {
      color: "#E86F3C",
    },
    identityPreviewEditButtonIcon: {
      color: "#E86F3C",
    },

    // ── Footer ─────────────────────────────────────────────────────────────
    footer: {
      background:   "transparent",
      borderTop:    "1px solid #3D3631",
      paddingTop:   "1rem",
    },
    footerActionText: {
      color: "#8A8680",
    },
    footerActionLink: {
      color:      "#E86F3C",
      fontWeight: "500",
    },

    // ── "Powered by Clerk" badge ───────────────────────────────────────────
    footerPages: {
      display: "none",
    },

    // ── OTP / code inputs ──────────────────────────────────────────────────
    otpCodeFieldInput: {
      background: "#14100E",
      border:     "1px solid #3D3631",
      color:      "#F5F1EA",
    },

    // ── "Last used" badge on social/OAuth buttons ──────────────────────────
    // Same pattern: string → our CSS has full control.
    badge: "habit-clerk-badge",
  },
};

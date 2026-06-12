export const heroBadge = "Digital Verification & Access Platform";

export const platformStats = [
  { num: "4", suffix: "", label: "Core Services" },
  { num: "500", suffix: "+", label: "Supported Apps" },
  { num: "100", suffix: "+", label: "Countries" },
  { num: "99", suffix: "%", label: "Delivery Rate" },
];

export const platformServices = [
  {
    slug: "temp-numbers",
    name: "Temp Numbers",
    tagline: "Receive SMS OTP codes instantly on disposable phone numbers.",
    icon: "fa-solid fa-sim-card",
    accent: "cyan",
    detailPath: "/services/temp-numbers",
    buyPath: "/get-number",
  },
  {
    slug: "temp-mail",
    name: "Temp Mail",
    tagline: "Get disposable emails and verification codes without using your inbox.",
    icon: "fa-solid fa-envelope-open-text",
    accent: "blue",
    detailPath: "/services/temp-mail",
    buyPath: "/get-mail",
  },
  {
    slug: "accounts",
    name: "Accounts",
    tagline: "Purchase ready-made platform accounts with credentials delivered instantly.",
    icon: "fa-solid fa-user-check",
    accent: "green",
    detailPath: "/services/accounts",
    buyPath: "/get-account",
  },
  {
    slug: "proxies",
    name: "Proxies",
    tagline: "Rent high-quality IPv4 & ISP proxies by location, period, and purpose.",
    icon: "fa-solid fa-shield-halved",
    accent: "orange",
    detailPath: "/services/proxies",
    buyPath: "/get-proxy",
  },
];

export const platformSteps = [
  {
    number: "01",
    title: "Create Your Account",
    desc: "Sign up in seconds with your email. One wallet for every service on EasyOtps.",
    icon: "fa-solid fa-user-plus",
  },
  {
    number: "02",
    title: "Top Up Your Balance",
    desc: "Add credits to your wallet. Pay only for what you use with no subscriptions.",
    icon: "fa-solid fa-wallet",
  },
  {
    number: "03",
    title: "Pick a Service",
    desc: "Choose temp numbers, temp mail, accounts, or proxies based on what you need.",
    icon: "fa-solid fa-layer-group",
  },
  {
    number: "04",
    title: "Get Results Instantly",
    desc: "OTP codes, emails, account credentials, or proxy details appear in your dashboard.",
    icon: "fa-solid fa-bolt",
  },
];

export const platformWhyUs = [
  {
    icon: "fa-solid fa-bolt-lightning",
    title: "Instant Delivery",
    desc: "Numbers, mails, accounts, and proxies are delivered in real time with no manual waiting.",
  },
  {
    icon: "fa-solid fa-lock",
    title: "Privacy First",
    desc: "Verify apps and services without exposing your personal phone number or email.",
  },
  {
    icon: "fa-solid fa-layer-group",
    title: "Unified Platform",
    desc: "Temp numbers, temp mail, accounts, and proxies in one place with a single wallet.",
  },
  {
    icon: "fa-solid fa-globe",
    title: "Global Coverage",
    desc: "Multiple providers, countries, and platforms so you can always find what you need.",
  },
  {
    icon: "fa-solid fa-sack-dollar",
    title: "Pay As You Go",
    desc: "No monthly lock-in. Top up your balance and pay per order starting from cents.",
  },
  {
    icon: "fa-solid fa-clock-rotate-left",
    title: "Full Order History",
    desc: "Track numbers, mails, accounts, proxies, and wallet transactions from one dashboard.",
  },
];

export const serviceDetails = {
  "temp-numbers": {
    slug: "temp-numbers",
    name: "Temp Numbers",
    badge: "SMS Verification",
    icon: "fa-solid fa-sim-card",
    accent: "cyan",
    buyPath: "/get-number",
    buyLabel: "Get a Number",
    headline: "Temporary Phone Numbers for SMS Verification",
    subtitle:
      "Buy disposable numbers from multiple providers, receive OTP codes live on your screen, and cancel or complete orders from one dashboard.",
    intro:
      "EasyOtps temp numbers let you verify apps and services without using your real phone. Pick a provider, service, country, and operator, then receive your verification code in real time on your dashboard.",
    useCases: [
      "Sign up on social media, messaging, or finance apps",
      "One-time OTP verification without a SIM card",
      "Testing apps across different countries and operators",
      "Scale verifications for marketing or automation workflows",
    ],
    features: [
      "Multiple SMS providers with country & operator selection",
      "Live OTP delivery on the order page with no refresh needed",
      "Cancel before code arrives for automatic wallet refund",
      "Number history with status, codes, and timestamps",
    ],
    steps: [
      {
        title: "Select Your Options",
        description:
          "Choose your SMS provider, target service, country, and operator from the request form.",
      },
      {
        title: "Check Price & Availability",
        description:
          "Review pricing and stock before placing your order.",
      },
      {
        title: 'Click "Get Number"',
        description:
          "Receive your temporary phone number instantly after confirming.",
      },
      {
        title: "Use the Number",
        description:
          "Enter the number in the app or website that requires SMS verification.",
      },
      {
        title: "Get Your Code",
        description:
          "Your OTP appears on the active orders panel within minutes.",
      },
    ],
    notes: [
      "Numbers are temporary and typically expire after 20 to 25 minutes",
      "Ensure sufficient wallet balance before ordering",
      "Using a VPN or proxy from the target country may improve success rates",
    ],
  },
  "temp-mail": {
    slug: "temp-mail",
    name: "Temp Mail",
    badge: "Email Verification",
    icon: "fa-solid fa-envelope-open-text",
    accent: "blue",
    buyPath: "/get-mail",
    buyLabel: "Get Temp Mail",
    headline: "Temporary Emails for Verification Codes",
    subtitle:
      "Purchase disposable email inboxes by service and domain. Incoming verification codes appear automatically on your order page.",
    intro:
      "When a platform sends email OTPs instead of SMS, temp mail gives you a private inbox for that verification without cluttering your personal email.",
    useCases: [
      "Email-based sign-ups on social and gaming platforms",
      "Services that send codes to Gmail, Outlook, or custom domains",
      "Bulk email verifications with quantity selection",
      "Re-order the same email for a new OTP when supported",
    ],
    features: [
      "Wide range of target services and email domains",
      "Live code delivery on the order page",
      "Purchase multiple inboxes in one order",
      "Mail history with reorder support when a code was received",
    ],
    steps: [
      {
        title: "Select a Service",
        description:
          "Choose the platform you need the email for, such as Facebook, Google, Telegram, or Discord.",
      },
      {
        title: "Choose Email Type",
        description:
          "Pick your preferred email domain or provider such as Gmail, Outlook, or Mail.com.",
      },
      {
        title: "Review Pricing",
        description:
          "Check price, stock, and delivery information before ordering.",
      },
      {
        title: "Select Quantity",
        description: "Choose how many temporary email accounts you need.",
      },
      {
        title: 'Click "Get Mail"',
        description: "Instantly generate your temporary email account(s).",
      },
      {
        title: "Receive Verification Emails",
        description:
          "Incoming emails and OTP codes appear automatically on your active orders panel.",
      },
    ],
    notes: [
      "Email accounts are temporary and may expire after a limited time",
      "Ensure sufficient wallet balance before ordering",
      "Use the email immediately after receiving it",
      "Some services may take longer to deliver verification emails",
    ],
  },
  accounts: {
    slug: "accounts",
    name: "Accounts",
    badge: "Ready-Made Access",
    icon: "fa-solid fa-user-check",
    accent: "green",
    buyPath: "/get-account",
    buyLabel: "Browse Accounts",
    headline: "Ready-Made Platform Accounts",
    subtitle:
      "Browse accounts by platform and category. Purchase credentials instantly and download your receipt after checkout.",
    intro:
      "Skip manual account creation. EasyOtps offers curated account listings grouped by platform and category, with username, password, and optional extras like cookies or two-factor keys.",
    useCases: [
      "Start working on a platform immediately without manual setup",
      "Buy accounts for specific niches or quality tiers",
      "Bulk purchases when stock is available",
      "Access listings with cookies or 2FA when offered",
    ],
    features: [
      "Browse by platform and category filters",
      "Instant delivery after purchase",
      "Downloadable purchase receipt",
      "Account history to review past purchases",
    ],
    steps: [
      {
        title: "Browse Listings",
        description:
          "Filter accounts by platform and category to find the listing that fits your need.",
      },
      {
        title: "Review Details",
        description:
          "Check price, available stock, and listing features before buying.",
      },
      {
        title: "Choose Quantity",
        description:
          "Select how many accounts you want within available stock limits.",
      },
      {
        title: "Purchase Instantly",
        description:
          "Complete the order and receive credentials immediately in your account history.",
      },
      {
        title: "Download Receipt",
        description:
          "Save your purchase receipt for your records after checkout.",
      },
    ],
    notes: [
      "Stock is limited per listing, so order while available",
      "Ensure sufficient wallet balance before purchasing",
      "Use credentials responsibly and follow platform terms",
      "Some listings include cookies or 2FA keys. Check listing details before buying.",
    ],
  },
  proxies: {
    slug: "proxies",
    name: "Proxies",
    badge: "IPv4 & ISP",
    icon: "fa-solid fa-shield-halved",
    accent: "orange",
    buyPath: "/get-proxy",
    buyLabel: "Get Proxy",
    headline: "IPv4 & ISP Proxy Rentals",
    subtitle:
      "Rent proxies by location, rental period, and usage purpose. Manage active proxies, renew, replace IPs, and change authentication.",
    intro:
      "EasyOtps proxies help you access platforms from the right location with dedicated IP connectivity, ideal for social, gaming, and other supported use cases.",
    useCases: [
      "Run accounts from the correct country or region",
      "Social media and messaging platform workflows",
      "Gaming and other supported platform activities",
      "Stable IP access for the duration you rent",
    ],
    features: [
      "IPv4 data center and ISP static residential proxies",
      "Choose location, period, purpose, and quantity",
      "Active proxy management from your dashboard",
      "Renew, replace IP, and change auth when needed",
    ],
    steps: [
      {
        title: "Select Proxy Type",
        description:
          "Choose IPv4 data center or ISP static residential proxies.",
      },
      {
        title: "Choose a Location",
        description:
          "Select the country or region for your proxy IP address.",
      },
      {
        title: "Select Rental Period",
        description:
          "Pick how long you need the proxy, such as weekly, monthly, or other available durations.",
      },
      {
        title: "Choose Usage Purpose",
        description:
          "Select the intended use such as social platforms, gaming, or other supported activities.",
      },
      {
        title: "Select Quantity",
        description: "Choose how many proxy connections or IPs you need.",
      },
      {
        title: 'Click "Get Proxy"',
        description:
          "Receive your proxy details and access credentials instantly.",
      },
    ],
    notes: [
      "Currently IPv4 and ISP proxy types are available",
      "Ensure sufficient wallet balance before placing an order",
      "Proxy availability may vary by location and demand",
      "Use proxies according to each platform's terms and policies",
    ],
  },
};

export const footerServiceLinks = platformServices.map((s) => ({
  label: s.name,
  to: s.detailPath,
}));

export const footerCompanyLinks = [
  { label: "All Services", to: "/services" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Top Up", to: "/topup" },
  { label: "Contact", to: "/#contact-us" },
];

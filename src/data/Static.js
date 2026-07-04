export const TOKEN_KEY = "auth_token";
//export const Base_Url = "https://api.easyotps.com";
export const Base_Url = "https://localhost:7265";

export const services = [
  {
    name: "WhatsApp",
    color: "#25D366",
    icon: "fa-brands fa-whatsapp",
  },
  { name: "Telegram", color: "#229ED9", icon: "fa-brands fa-telegram" },
  { name: "Facebook", color: "#1877F2", icon: "fa-brands fa-facebook" },
  {
    name: "Instagram",
    color: "#E1306C",
    icon: "fa-brands fa-square fa-instagram",
  },
  { name: "YouTube", color: "#FF0000", icon: "fa-brands fa-youtube" },
  {
    name: "Twitter / X",
    color: "#000000",
    icon: "fa-brands fa-x-twitter",
  },
  { name: "TikTok", color: "#010101", icon: "fa-brands fa-tiktok" },
  { name: "Gmail", color: "#EA4335", icon: "fa-brands fa-google" },
  { name: "Discord", color: "#5865F2", icon: "fa-brands fa-discord" },
  { name: "Snapchat", color: "#FFFC00", icon: "fa-brands fa-snapchat" },
  { name: "Amazon", color: "#FF9900", icon: "fa-brands fa-amazon" },
  { name: "Uber", color: "#000000", icon: "fa-brands fa-uber" },
];

export const mailServices = [
  { id: "fb", name: "Facebook" },
  { id: "ig", name: "Instagram" },
  { id: "tw", name: "Twitter" },
  { id: "tg", name: "Telegram" },
  { id: "wa", name: "WhatsApp" },
  { id: "fu", name: "Snapchat" },

  { id: "ds", name: "Discord" },
  { id: "mt", name: "Steam" },
  { id: "bz", name: "Blizzard" },
  { id: "ane", name: "Supercell" },

  { id: "nf", name: "Netflix" },
  { id: "am", name: "Amazon" },
  { id: "dh", name: "eBay" },

  { id: "dr", name: "OpenAI" },
  { id: "mm", name: "Microsoft" },
  { id: "go", name: "Google" },
  { id: "yt", name: "YouTube" },
  { id: "gm", name: "Gmail" },

  { id: "li", name: "LinkedIn" },
  { id: "cn", name: "Fiverr" },
  { id: "ds2", name: "DocuSign" },

  { id: "aon", name: "Binance" },
  { id: "aor", name: "OKX" },
  { id: "re", name: "Coinbase" },

  { id: "ts", name: "PayPal" },
  { id: "aok", name: "NETELLER" },
  { id: "aqt", name: "Skrill" },

  { id: "uk", name: "Airbnb" },
  { id: "ub", name: "Uber" },
  { id: "rr", name: "Wolt" },
  { id: "aq", name: "Glovo" },
];

export const steps = [
  {
    number: "01",
    title: "Create Your Account",
    desc: "Sign up in seconds. No personal info required — just an email and you're in.",
    icon: "fa-solid fa-user",
  },
  {
    number: "02",
    title: "Top Up Your Balance",
    desc: "Add credits instantly. Numbers start from as low as $0.05 per verification.",
    icon: "fa-solid fa-credit-card",
  },
  {
    number: "03",
    title: "Choose Service & Country",
    desc: "Pick the app you need a number for and select your preferred country.",
    icon: "fa-solid fa-globe",
  },
  {
    number: "04",
    title: "Receive Your SMS Code",
    desc: "Your temporary number is ready. Get the OTP code instantly on your screen.",
    icon: "fa-solid fa-key",
  },
];

export const WhyUs = [
  {
    icon: "fa-solid fa-bolt-lightning",
    title: "Instant Delivery",
    desc: "Numbers are issued within seconds. SMS codes arrive in real-time — no refreshing, no waiting.",
  },
  {
    icon: "fa-solid fa-lock",
    title: "100% Anonymous",
    desc: "We never ask for your real phone number. No KYC, no ID — just sign up and go.",
  },
  {
    icon: "fa-solid fa-globe",
    title: "Global Coverage",
    desc: "Choose from numbers in 100+ countries across 6 continents. Always find the right number for your target service.",
  },
  {
    icon: "fa-solid fa-sack-dollar",
    title: "Pay As You Go",
    desc: "No monthly fees. Recharge only what you need, starting from $0.05 per verification.",
  },
  {
    icon: "fa-solid fa-repeat",
    title: "Unlimited Numbers",
    desc: "Need 10 verifications or 10,000? Scale freely. Each number is fresh, clean, and ready to use.",
  },
  {
    icon: "fa-solid fa-shield",
    title: "Trusted Platform",
    desc: "Over 12 million numbers issued. Trusted by developers, marketers, and privacy-conscious users worldwide.",
  },
];

export const features = [
  {
    icon: "fa-solid fa-bolt-lightning",
    title: "Instant Activation",
    desc: "Your balance is live the moment payment clears.",
  },
  {
    icon: "fa-solid fa-lock",
    title: "Secure & Private",
    desc: "Every transaction is encrypted end-to-end.",
  },
  {
    icon: "fa-solid fa-mobile-retro",
    title: "Numbers On Demand",
    desc: "Access any number worldwide, anytime.",
  },
  {
    icon: "fa-solid fa-infinity",
    title: "Never Expire",
    desc: "Your balance stays until you use it. No hidden fees.",
  },
];

export const punchlines = [
  "Don't let an empty balance cost you a deal.",
  "Top up once. Verify forever.",
  "Your next number is one top-up away.",
  "Stay ready. Stay verified.",
];

export const verificationPurpose = {
  forgotPassword: "1",
};

export const ContactUsSubjects = [
  {
    value: "1",
    key: "GeneralInquiry",
    label: "General Inquiry",
    code: "General",
    category: "Support",
  },
  {
    value: "2",
    key: "TechnicalSupport",
    label: "Technical Support",
    code: "Technical",
    category: "Support",
  },
  {
    value: "3",
    key: "BillingIssue",
    label: "Billing Issue",
    code: "Billing",
    category: "Finance",
  },
  {
    value: "4",
    key: "RefundIssue",
    label: "Refund Request",
    code: "Refund",
    category: "Finance",
  },
  {
    value: "5",
    key: "AccountAccessProblem",
    label: "Account Access Problem",
    code: "Account",
    category: "Support",
  },
  {
    value: "6",
    key: "FeatureRequest",
    label: "Feature Request",
    code: "Feature",
    category: "Product",
  },
  {
    value: "7",
    key: "BugReport",
    label: "Bug Report",
    code: "Bug",
    category: "Engineering",
  },
  {
    value: "8",
    key: "PartnershipOrBusiness",
    label: "Partnership or Business",
    code: "Business",
    category: "Sales",
  },
  {
    value: "9",
    key: "FeedbackOrSuggestion",
    label: "Feedback or Suggestion",
    code: "Feedback",
    category: "Product",
  },
  {
    value: "10",
    key: "Other",
    label: "Other",
    code: "Other",
    category: "Support",
  },
];

export const modalKeys = {
  all: "all",
  addAccountGroup: "add-account-group",
  updateAccountGroup: "update-account-group",
  toggleAccountGroup: "toggle-account-group",
  newAccount: "account",
  resultModal: "result-modal",
  changePassword: "change-password",
  changeEmail: "change-email",
  upsertPlatform: "upsert-platform",
  platformConfiguration: "platform-configuration",
  contactUsMessage: "contact-us-message",
  contactUsReply: "contact-us-reply",
  proxyAuthChange: "proxy-auth-change",
  exportProxy: "export-proxy",
  replaceIp: "replace-ip",
  extendProxy: "extend-proxy",
  providerProfit: "provider-profit",
  referralCommission: "referral-commission",
  physicalNumberActive: "physical-number-active",
  physicalNumberExpiry: "physical-number-expiry",
};

export const NumberStatus = [
  { label: "All", value: 0 },
  { label: "Active", value: 1 },
  { label: "Cancelled", value: 2 },
  { label: "Completed", value: 3 },
];

export const PhysicalNumberStatus = [
  { label: "All", value: 0 },
  { label: "Sold", value: 6 },
  { label: "UnSold", value: 1 },
];

export const Providers = [
  {
    label: "All",
    value: 0,
  },
  {
    label: "Provider A",
    value: 1,
  },
  {
    label: "Provider B",
    value: 4,
  },
  {
    label: "Premium Numbers",
    value: 3,
  },
];

export const AdminConst = {
  email: "zbrkhakwani@gmail.com",
  phoneNumber: "923185924729",
};

export const WalletTransactionTypes = [
  { label: "All Types", value: "" },
  { label: "Top Up", value: "1" },
  { label: "Purchase", value: "2" },
  { label: "Refund", value: "3" },
  { label: "Re-order", value: "4" },
  { label: "Adjustment", value: "5" },
  { label: "Balance Withdrawal", value: "6" },
];

export const ProxyTypes = [
  {
    displayName: "IPV4 (Data Center)",
    label: "Ipv4",
    value: "1",
  },
  {
    displayName: "ISP (Static Residential)",
    label: "Isp",
    value: "2",
  },
];

export const proxyIssueTypes = [
  {
    label: "Not Working",
    value: "1",
  },
  {
    label: "Incorrect Location",
    value: "2",
  },
  {
    label: "Can't Change Network",
    value: "3",
  },
  {
    label: "Low Speed",
    value: "4",
  },
  {
    label: "Custom",
    value: "5",
  },
];

export const BalanceCorrectionReasons = [
  {
    displayName: "Incorrect Amount Entry",
    label: "IncorrectAmountEntry",
    value: "1",
  },
  {
    displayName: "Duplicate Transaction Entry",
    label: "DuplicateTransactionEntry",
    value: "2",
  },
  {
    displayName: "Credited To Wrong User",
    label: "CreditedToWrongUser",
    value: "3",
  },
  {
    displayName: "Overcharge Correction",
    label: "OverchargeCorrection",
    value: "4",
  },
  {
    displayName: "Test Entry Reversal",
    label: "TestEntryReversal",
    value: "5",
  },
  {
    displayName: "Admin Manual Adjustment",
    label: "AdminManualAdjustment",
    value: "6",
  },
  {
    displayName: "Withdraw",
    label: "Withdraw",
    value: "7",
  },
  {
    displayName: "Wrong Value",
    label: "Wronggg",
    value: "8",
  },
];

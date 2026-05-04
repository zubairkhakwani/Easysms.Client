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
    value: 1,
    key: "GeneralInquiry",
    label: "General Inquiry",
    code: "General",
    category: "Support",
  },
  {
    value: 2,
    key: "TechnicalSupport",
    label: "Technical Support",
    code: "Technical",
    category: "Support",
  },
  {
    value: 3,
    key: "BillingIssue",
    label: "Billing Issue",
    code: "Billing",
    category: "Finance",
  },
  {
    value: 4,
    key: "RefundIssue",
    label: "Refund Request",
    code: "Refund",
    category: "Finance",
  },
  {
    value: 5,
    key: "AccountAccessProblem",
    label: "Account Access Problem",
    code: "Account",
    category: "Support",
  },
  {
    value: 6,
    key: "FeatureRequest",
    label: "Feature Request",
    code: "Feature",
    category: "Product",
  },
  {
    value: 7,
    key: "BugReport",
    label: "Bug Report",
    code: "Bug",
    category: "Engineering",
  },
  {
    value: 8,
    key: "PartnershipOrBusiness",
    label: "Partnership or Business",
    code: "Business",
    category: "Sales",
  },
  {
    value: 9,
    key: "FeedbackOrSuggestion",
    label: "Feedback or Suggestion",
    code: "Feedback",
    category: "Product",
  },
  {
    value: 10,
    key: "Other",
    label: "Other",
    code: "Other",
    category: "Support",
  },
];

export const modalKeys = {
  all: "all",
  newAccountGroup: "account-group",
  newAccount: "account",
  resultModal: "result-modal",
  changePassword: "change-password",
  changeEmail: "change-email",
  upsertPlatform: "upsert-platform",
  platformConfiguration: "platform-configuration",
  contactUsMessage: "contact-us-message",
  contactUsReply: "contact-us-reply",
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
  { label: "Active", value: 1 },
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
    value: 2,
  },
  {
    label: "USA/Canada Premium Numbers",
    value: 3,
  },
];

export const AdminConst = {
  email: "zbrkhakwani@gmail.com",
  phoneNumber: "923185924729",
};

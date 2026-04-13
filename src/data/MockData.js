export const providers = [
  { id: "all", name: "All Providers" },
  { id: "p1", name: "TeleConnect Pro" },
  { id: "p2", name: "SwiftSMS Global" },
  { id: "p3", name: "NexusOTP" },
  { id: "p4", name: "PulseMessage" },
  { id: "p5", name: "SignalBridge" },
];

export const providerBalances = [
  {
    id: "p1",
    name: "TeleConnect Pro",
    initials: "TC",
    plan: "Enterprise",
    balance: 48320.5,
    change: +2.4,
    changeUp: true,
    status: "online",
    color: "#00e5ff",
  },
  {
    id: "p2",
    name: "SwiftSMS Global",
    initials: "SS",
    plan: "Pro",
    balance: 31740.0,
    change: +1.1,
    changeUp: true,
    status: "online",
    color: "#7c3aed",
  },
  {
    id: "p3",
    name: "NexusOTP",
    initials: "NO",
    plan: "Pro",
    balance: 9850.75,
    change: -0.8,
    changeUp: false,
    status: "warning",
    color: "#00ffaa",
  },
  {
    id: "p4",
    name: "PulseMessage",
    initials: "PM",
    plan: "Standard",
    balance: 1240.0,
    change: -5.2,
    changeUp: false,
    status: "warning",
    color: "#ff9d3d",
  },
  {
    id: "p5",
    name: "SignalBridge",
    initials: "SB",
    plan: "Starter",
    balance: 320.25,
    change: -12.0,
    changeUp: false,
    status: "offline",
    color: "#ff5f7e",
  },
];

export const defaultStats = {
  totalProviders: 5,
  totalSales: 284730,
  totalRevenue: 1482650,
  totalOtps: 9472810,
  topSalesProvider: "TeleConnect Pro",
  topRevenueProvider: "SwiftSMS Global",
};

export const providerStats = {
  all: {
    totalSales: 284730,
    totalRevenue: 1482650,
    totalOtps: 9472810,
    topSalesProvider: "TeleConnect Pro",
    topRevenueProvider: "SwiftSMS Global",
  },
  p1: {
    totalSales: 98340,
    totalRevenue: 512400,
    totalOtps: 3210000,
    topSalesProvider: "TeleConnect Pro",
    topRevenueProvider: "TeleConnect Pro",
  },
  p2: {
    totalSales: 74210,
    totalRevenue: 389000,
    totalOtps: 2440000,
    topSalesProvider: "SwiftSMS Global",
    topRevenueProvider: "SwiftSMS Global",
  },
  p3: {
    totalSales: 51980,
    totalRevenue: 274500,
    totalOtps: 1820000,
    topSalesProvider: "NexusOTP",
    topRevenueProvider: "NexusOTP",
  },
  p4: {
    totalSales: 38820,
    totalRevenue: 199650,
    totalOtps: 1330000,
    topSalesProvider: "PulseMessage",
    topRevenueProvider: "PulseMessage",
  },
  p5: {
    totalSales: 21380,
    totalRevenue: 107100,
    totalOtps: 672810,
    topSalesProvider: "SignalBridge",
    topRevenueProvider: "SignalBridge",
  },
};

export const topProvidersBySales = [
  {
    name: "TeleConnect Pro",
    sales: 98340,
    percentage: 100,
    plan: "Enterprise",
  },
  { name: "SwiftSMS Global", sales: 74210, percentage: 75, plan: "Pro" },
  { name: "NexusOTP", sales: 51980, percentage: 53, plan: "Pro" },
  { name: "PulseMessage", sales: 38820, percentage: 39, plan: "Standard" },
  { name: "SignalBridge", sales: 21380, percentage: 22, plan: "Starter" },
];

export const topProvidersByRevenue = [
  {
    name: "SwiftSMS Global",
    revenue: 512400,
    percentage: 100,
    plan: "Enterprise",
  },
  { name: "TeleConnect Pro", revenue: 389000, percentage: 76, plan: "Pro" },
  { name: "NexusOTP", revenue: 274500, percentage: 54, plan: "Pro" },
  { name: "PulseMessage", revenue: 199650, percentage: 39, plan: "Standard" },
  { name: "SignalBridge", revenue: 107100, percentage: 21, plan: "Starter" },
];

export const recentOtpActivity = [
  {
    id: 1,
    provider: "TeleConnect Pro",
    time: "2 min ago",
    status: "success",
    count: 1420,
  },
  {
    id: 2,
    provider: "SwiftSMS Global",
    time: "5 min ago",
    status: "success",
    count: 890,
  },
  {
    id: 3,
    provider: "NexusOTP",
    time: "11 min ago",
    status: "pending",
    count: 340,
  },
  {
    id: 4,
    provider: "PulseMessage",
    time: "18 min ago",
    status: "success",
    count: 610,
  },
  {
    id: 5,
    provider: "SignalBridge",
    time: "22 min ago",
    status: "fail",
    count: 45,
  },
  {
    id: 6,
    provider: "TeleConnect Pro",
    time: "31 min ago",
    status: "success",
    count: 2080,
  },
  {
    id: 7,
    provider: "NexusOTP",
    time: "45 min ago",
    status: "success",
    count: 770,
  },
];

export const formatNumber = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
};

export const formatCurrency = (n) => {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + n?.toLocaleString();
};

export const platforms = [
  {
    id: "facebook",
    name: "Facebook",
    categories: [
      { id: "fb-personal", name: "Personal Accounts", platformId: "facebook" },
      { id: "fb-business", name: "Business Accounts", platformId: "facebook" },
      { id: "fb-aged", name: "Aged Accounts", platformId: "facebook" },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    categories: [
      { id: "ig-standard", name: "Standard Accounts", platformId: "instagram" },
      { id: "ig-creator", name: "Creator Accounts", platformId: "instagram" },
    ],
  },
  {
    id: "twitter",
    name: "Twitter / X",
    categories: [
      { id: "tw-standard", name: "Standard Accounts", platformId: "twitter" },
      { id: "tw-verified", name: "Verified Accounts", platformId: "twitter" },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    categories: [
      { id: "tt-new", name: "New Accounts", platformId: "tiktok" },
      { id: "tt-aged", name: "Aged Accounts", platformId: "tiktok" },
    ],
  },
];

export const accountGroups = [
  {
    id: "1",
    platformName: "Facebook",
    categoryName: "Personal Accounts",
    description:
      "High-quality aged Facebook accounts with full profile completion and activity history.",
    registrationCountry: "United States",
    gender: "Mixed",
    completionStatus: "Complete",
    totalAvailable: 125,
    unitPrice: 2.5,
    has2FA: true,
    hasCookie: true,
    hasRegistrationData: true,
    hasFriends: true,
    hasFollowers: false,
    isAdEligible: true,
    friendsCount: 250,
    followersCount: 0,
    businessManagerCount: 1,
  },
  {
    id: "2",
    platformName: "Facebook",
    categoryName: "Business Accounts",
    description:
      "Business Manager ready accounts with ad spending history and verified payment methods.",
    registrationCountry: "United Kingdom",
    gender: "Male",
    completionStatus: "Complete",
    totalAvailable: 43,
    unitPrice: 8.0,
    has2FA: true,
    hasCookie: true,
    hasRegistrationData: true,
    hasFriends: true,
    hasFollowers: true,
    isAdEligible: true,
    friendsCount: 500,
    followersCount: 120,
    businessManagerCount: 3,
  },
  {
    id: "3",
    platformName: "Instagram",
    categoryName: "Creator Accounts",
    description:
      "Established creator accounts with engaged follower base and content history.",
    registrationCountry: "Brazil",
    gender: "Female",
    completionStatus: "Partial",
    totalAvailable: 0,
    unitPrice: 12.0,
    has2FA: false,
    hasCookie: true,
    hasRegistrationData: false,
    hasFriends: false,
    hasFollowers: true,
    isAdEligible: false,
    friendsCount: 0,
    followersCount: 5000,
    businessManagerCount: 0,
  },
  {
    id: "4",
    platformName: "Twitter / X",
    categoryName: "Standard Accounts",
    description:
      "Fresh Twitter accounts with email verification and phone number attached.",
    registrationCountry: "Germany",
    gender: "Unknown",
    completionStatus: "Minimal",
    totalAvailable: 300,
    unitPrice: 1.2,
    has2FA: false,
    hasCookie: false,
    hasRegistrationData: true,
    hasFriends: false,
    hasFollowers: false,
    isAdEligible: false,
    friendsCount: 0,
    followersCount: 0,
    businessManagerCount: 0,
  },
  {
    id: "5",
    platformName: "Facebook",
    categoryName: "Aged Accounts",
    description:
      "5+ year old Facebook accounts with natural activity patterns and marketplace access enabled.",
    registrationCountry: "Canada",
    gender: "Mixed",
    completionStatus: "Complete",
    totalAvailable: 67,
    unitPrice: 5.5,
    has2FA: true,
    hasCookie: true,
    hasRegistrationData: true,
    hasFriends: true,
    hasFollowers: true,
    isAdEligible: true,
    friendsCount: 800,
    followersCount: 300,
    businessManagerCount: 2,
  },
  {
    id: "6",
    platformName: "TikTok",
    categoryName: "Aged Accounts",
    description:
      "Aged TikTok accounts with established posting history and follower base.",
    registrationCountry: "Indonesia",
    gender: "Female",
    completionStatus: "Partial",
    totalAvailable: 89,
    unitPrice: 3.75,
    has2FA: false,
    hasCookie: true,
    hasRegistrationData: true,
    hasFriends: false,
    hasFollowers: true,
    isAdEligible: true,
    friendsCount: 0,
    followersCount: 1500,
    businessManagerCount: 0,
  },
];

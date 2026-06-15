export const Permissions = Object.freeze({
  ViewPatforms: "ViewPatforms",
  CreatePlatform: "CreatePlatform",
  EditPlatform: "EditPlatform",
  CreateCategory: "CreateCategory",
  ViewAccountGroups: "ViewAccountGroups",
  ManageAccountGroups: "ManageAccountGroups",
  AddAccounts: "AddAccounts",
  AddPhysicalNumbers: "AddPhysicalNumbers",
  ViewActiveNumbers: "ViewActiveNumbers",
  ViewActiveProxies: "ViewActiveProxies",
  ViewProviderHistory: "ViewProviderHistory",
  ViewUsers: "ViewUsers",
  TopupUserBalance: "TopupUserBalance",
  ViewUserDeposits: "ViewUserDeposits",
  ViewContactUs: "ViewContactUs",
  ManageContactUs: "ManageContactUs",
  ViewOverview: "ViewOverview",
  ViewProviderProfit: "ViewProviderProfit",
  UpsertProviderProfit: "UpsertProviderProfit",
  ViewReferralCommission: "ViewReferralCommission",
  UpsertReferralCommission: "UpsertReferralCommission",
});

export const navItems = [
  {
    section: "Main",
    items: [
      {
        icon: "⬡",
        label: "Overview",
        id: "overview",
        active: true,
        url: "overview",
      },
    ],
  },
  {
    section: "Management",

    items: [
      {
        icon: "⊞",
        label: "Physical Number",
        id: "physicalNumber",
        url: "physical-number",
        permission: Permissions.AddPhysicalNumbers,
      },

      {
        icon: "⊕",
        label: "Users",
        id: "users",
        url: "manage-user",
        permission: Permissions.ViewUsers,
      },
      {
        icon: "⊕",
        label: "Deposits",
        id: "deposits",
        url: "deposits",
        permission: Permissions.ViewUserDeposits,
      },
      {
        icon: "⊞",
        label: "Contact us",
        id: "contactUs",
        url: "contact-us",
        permission: Permissions.ViewContactUs,
      },
    ],
  },
  {
    section: "Provider",
    items: [
      {
        icon: "⊞",
        label: "Activation History",
        id: "activationHistory",
        url: "provider-history",
        permission: Permissions.ViewProviderHistory,
      },
      {
        icon: "◈",
        label: "Active numbers",
        id: "activeNumbers",
        url: "active-numbers",
        permission: Permissions.ViewActiveNumbers,
      },
      {
        icon: "◈",
        label: "Active proxies",
        id: "activeProxies",
        url: "active-proxies",
        permission: Permissions.ViewActiveProxies,
      },
    ],
  },
  {
    section: "Buy",
    items: [
      {
        icon: "⊞",
        label: "Buy Temp Number",
        id: "getNumber",
        url: "/get-number",
      },
      {
        icon: "⊞",
        label: "Buy Account",
        id: "getAccount",
        url: "/get-account",
      },
      {
        icon: "⊞",
        label: "Buy Temp mail",
        id: "getMail",
        url: "/get-mail",
      },
      {
        icon: "⊞",
        label: "Buy Proxy",
        id: "getproxy",
        url: "/get-proxy",
      },
    ],
  },
  {
    section: "Accounts",
    items: [
      {
        icon: "⊞",
        label: "Platforms",
        id: "platform",
        url: "platforms",
        permission: Permissions.ViewPatforms,
      },
      {
        icon: "⊞",
        label: "Categories",
        id: "category",
        url: "categories",
        permission: Permissions.CreateCategory,
      },
      {
        icon: "⊞",
        label: "Account groups",
        id: "accountGroups",
        url: "account-groups",
        permission: Permissions.ManageAccountGroups,
      },
    ],
  },
  {
    section: "Settings",
    items: [
      {
        icon: "⊞",
        label: "Provider Profit",
        id: "proivderProfit",
        url: "provider-profit",
        permission: Permissions.ViewProviderProfit,
      },
      {
        icon: "⊞",
        label: "Referral Commission",
        id: "referralCommission",
        url: "referral-commission",
        badge: "New",
        permission: Permissions.ViewReferralCommission,
      },
    ],
  },
];

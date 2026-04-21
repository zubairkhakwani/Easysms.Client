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
  ViewProviderHistory: "ViewProviderHistory",
  ViewUsers: "ViewUsers",
  TopupUserBalance: "TopupUserBalance",
  ViewUserDeposits: "ViewUserDeposits",
  ViewContactUs: "ViewContactUs",
  ManageContactUs: "ManageContactUs",
  ViewOverview: "ViewOverview",
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
    ],
  },
  {
    section: "Accounts & Numbers",
    items: [
      {
        icon: "⊞",
        label: "Buy Number",
        id: "getNumber",
        url: "/get-number",
      },
      // {
      //   icon: "⊞",
      //   label: "Buy Account",
      //   id: "getAccount",
      //   url: "/get-account",
      // },
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
        badge: "New",
        permission: Permissions.ViewPatforms,
      },
      {
        icon: "⊞",
        label: "Categories",
        id: "category",
        url: "categories",
        badge: "New",
        permission: Permissions.CreateCategory,
      },
      {
        icon: "⊞",
        label: "Account groups",
        id: "accountGroups",
        url: "account-groups",
        badge: "New",
        permission: Permissions.ManageAccountGroups,
      },
    ],
  },
];

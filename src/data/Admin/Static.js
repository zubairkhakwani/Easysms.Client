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
      },

      { icon: "⊕", label: "Users", id: "users", url: "manage-user" },
      {
        icon: "⊕",
        label: "Deposits",
        id: "deposits",
        url: "deposits",
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
      },
      {
        icon: "◈",
        label: "Active numbers",
        id: "activeNumbers",
        url: "active-numbers",
      },
    ],
  },
  {
    section: "Numbers",
    items: [
      {
        icon: "⊞",
        label: "Get Number",
        id: "getNumber",
        url: "/get-number",
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
        badge: "New",
      },
      {
        icon: "⊞",
        label: "Categories",
        id: "category",
        url: "categories",
        badge: "New",
      },
      {
        icon: "⊞",
        label: "Account groups",
        id: "accountGroups",
        url: "account-groups",
        badge: "New",
      },
    ],
  },
];

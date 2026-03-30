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
        badge: "New",
      },
    ],
  },
];

export const providers = [
  {
    id: "1",
    name: "Hero Sms",
    codeName: "Provider A",
  },
  {
    id: "2",
    name: "Five Sim .Net",
    codeName: "Provider B",
  },
  {
    id: "3",
    name: "USA/Canada Premium Numbers",
    codeName: "USA/Canada Premium Numbers",
  },
];

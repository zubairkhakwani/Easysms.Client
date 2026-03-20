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
      { icon: "◈", label: "Analytics", id: "analytics", url: "overview" },
      {
        icon: "◉",
        label: "Reports",
        id: "reports",
        badge: "New",
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
        id: "Physical Number",
        url: "physical-number",
      },

      { icon: "⊕", label: "Users", id: "users", url: "manage-user" },
    ],
  },
  {
    section: "Provder",
    items: [
      {
        icon: "⊞",
        label: "Activation History",
        id: "Activation History",
        url: "provider-history",
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

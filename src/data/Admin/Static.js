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
      { icon: "⊛", label: "Transactions", id: "transactions" },
      { icon: "⊕", label: "Users", id: "users", url: "manage-user" },
    ],
  },
  {
    section: "System",
    items: [
      { icon: "⊟", label: "Settings", id: "settings" },
      { icon: "◫", label: "Audit Logs", id: "audit" },
      { icon: "◻", label: "API Keys", id: "api-keys" },
    ],
  },
];

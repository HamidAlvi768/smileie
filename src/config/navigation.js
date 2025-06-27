export const headerMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "mdi mdi-home-outline",
    url: "/dashboard",
  },
  {
    id: "patients",
    label: "Patients",
    icon: "mdi mdi-account-group-outline",
    navbarItems: [
      {
        id: "monitored",
        label: "Monitored",
        url: "/patients/monitored",
      },
      {
        id: "not-monitored",
        label: "Not Monitored",
        url: "/patients/not-monitored",
      },
      // {
      //   id: "guardians",
      //   label: "Guardians",
      //   url: "/patients/guardians",
      // },
    ],
  },
  {
    id: "doctors",
    label: "Doctors",
    icon: "mdi mdi-stethoscope",
    url: "/doctors",
  },
  {
    id: "orders",
    label: "Orders",
    icon: "mdi mdi-package-variant-closed",
    url: "/orders",
    navbarItems: [
      {
        id: "order-list",
        label: "Order List",
        url: "/orders",
      }
    ],
  },
  // {
  //   id: "todo",
  //   label: "To-Do List",
  //   icon: "mdi mdi-format-list-checks",
  //   navbarItems: [
  //     {
  //       id: "monitored",
  //       label: "Monitored",
  //       url: "/todo/monitored",
  //     },
  //     {
  //       id: "not-monitored",
  //       label: "Not Monitored",
  //       url: "/todo/not-monitored",
  //     },
  //     {
  //       id: "guardians",
  //       label: "Guardians",
  //       url: "/todo/guardians",
  //     },
  //   ],
  // },
  // {
  //   id: "quick-replies",
  //   label: "Quick Replies",
  //   icon: "mdi mdi-reply-all-outline",
  //   navbarItems: [
  //     {
  //       id: "templates",
  //       label: "Templates",
  //       url: "/quick-replies",
  //     }
  //   ],
  // },
];

export const headerRightMenuItems = [
  {
    id: "notifications",
    label: "Notifications",
    url: "/notifications/messages",
    badge: 1,
  },
  {
    id: "help",
    label: "Help",
    url: "/help", // This will be handled specially in Header.js if needed
  },
  {
    id: "settings",
    label: "Settings",
    url: "/settings",
  },
  {
    id: "my-account",
    label: "My Account",
    url: "/my-account",
  },
  {
    id: "logout",
    label: "Logout",
    url: "/auth-login",
  },
]; 
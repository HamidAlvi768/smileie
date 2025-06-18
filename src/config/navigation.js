export const headerMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "mdi mdi-home-outline",
    url: "/dashboard",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: "mdi mdi-bell-outline",
    navbarItems: [
      {
        id: "messages",
        label: "Messages",
        url: "/notifications/messages",
      },
      {
        id: "clinical-instructions",
        label: "Clinical Instructions",
        url: "/notifications/clinical-instructions",
      },
      {
        id: "additional-scans",
        label: "Additional Scans",
        url: "/notifications/additional-scans",
      },
      {
        id: "app-not-activated",
        label: "App Not Activated",
        url: "/notifications/app-not-activated",
      },
    ],
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
      {
        id: "guardians",
        label: "Guardians",
        url: "/patients/guardians",
      },
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
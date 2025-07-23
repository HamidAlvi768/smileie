// Base navigation items (will be filtered by role)
export const baseHeaderMenuItems = [
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
    url: "/patients",
  },
  {
    id: "doctors",
    label: "Doctors",
    icon: "mdi mdi-stethoscope",
    url: "/doctors",
  },
  // {
  //   id: "orders",
  //   label: "Orders",
  //   icon: "mdi mdi-package-variant-closed",
  //   url: "/orders",
  //   // navbarItems: [
  //   //   {
  //   //     id: "order-list",
  //   //     label: "Order List",
  //   //     url: "/orders",
  //   //   }
  //   // ],
  // },
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

// Function to get role-based header menu items
export const getHeaderMenuItems = (userRole) => {
  if (!userRole) return baseHeaderMenuItems;
  
  // Filter out doctors and settings for doctor role
  if (userRole === 'doctor') {
    return baseHeaderMenuItems.filter(item => 
      item.id !== 'doctors' && item.id !== 'dashboard'
    );
  }
  
  return baseHeaderMenuItems;
};

// Default export for backward compatibility
export const headerMenuItems = baseHeaderMenuItems;

// Base right menu items (will be filtered by role)
export const baseHeaderRightMenuItems = [
  {
    id: "notifications",
    label: "Notifications",
    url: "/notifications/messages",
    badge: 1,
  },
  // {
  //   id: "help",
  //   label: "Help",
  //   url: "/help", // This will be handled specially in Header.js if needed
  // },
  {
    id: "settings",
    label: "Settings",
    url: "/settings",
    navbarItems: [
      {
        id: "treatment-plans",
        label: "Treatment Plans",
        url: "/settings/treatment-plans",
      },
      {
        id: "video-tutorials",
        label: "Video Tutorials",
        url: "/settings/video-tutorials",
      },
    ],
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

// Function to get role-based right menu items
export const getHeaderRightMenuItems = (userRole) => {
  if (!userRole) return baseHeaderRightMenuItems;
  
  // Filter out settings for doctor role
  if (userRole === 'doctor') {
    return baseHeaderRightMenuItems.filter(item => item.id !== 'settings');
  }
  
  return baseHeaderRightMenuItems;
};

// Default export for backward compatibility
export const headerRightMenuItems = baseHeaderRightMenuItems; 
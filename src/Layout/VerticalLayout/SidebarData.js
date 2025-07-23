// Base sidebar data (will be filtered by role)
const baseSidebarData = [
    {
        label: "Menu",
        isMainMenu: true,
    },
    {
        label: "Dashboard",
        icon: "mdi mdi-home-outline",
        url: "/dashboard"
    },
    {
        label: "Notifications",
        icon: "mdi mdi-bell-outline",
        url: "/notifications"
    },
    {
        label: "Patients",
        icon: "mdi mdi-account-group-outline",
        url: "/patients"
    },
    {
        label: "Doctors",
        icon: "mdi mdi-stethoscope",
        url: "/doctors"
    },
    {
        label: "Settings",
        icon: "mdi mdi-cog",
        url: "/settings"
    },
    {
        label: "To-Do List",
        icon: "mdi mdi-format-list-checks",
        url: "/todo-list"
    },
    {
        label: "Quick Replies",
        icon: "mdi mdi-reply-all-outline",
        url: "/quick-replies"
    }
];

// Function to get role-based sidebar data
export const getSidebarData = (userRole) => {
    if (!userRole) return baseSidebarData;
    
    // Filter out doctors, settings, and dashboard for doctor role
    if (userRole === 'doctor') {
        return baseSidebarData.filter(item => 
            item.label !== 'Doctors' && item.label !== 'Settings' && item.label !== 'Dashboard'
        );
    }
    
    return baseSidebarData;
};

// Default export for backward compatibility
const SidebarData = baseSidebarData;
export default SidebarData;
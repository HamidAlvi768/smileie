import React from "react";

const Navdata = () => {
  const NavnavData = [
    {
      label: "Menu",
      isMainMenu: true,
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
  return <React.Fragment>{NavnavData}</React.Fragment>;
};

export default Navdata;

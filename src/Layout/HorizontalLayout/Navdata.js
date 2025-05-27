import React, { useState } from "react";

const Navdata = () => {
  const [ui, setui] = useState(false);

  const NavnavData = [
    {
      id: 1,
      label: "Dashboard",
      icon: "mdi mdi-home-variant-outline me-2",
      isdropDown: true,
      click: function () {
        setui(false);
      },
    }
  ];
  
  return <React.Fragment>{NavnavData}</React.Fragment>;
};

export default Navdata;

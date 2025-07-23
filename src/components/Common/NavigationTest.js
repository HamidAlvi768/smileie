import React from "react";
import { useRoleAccess } from "../../Hooks/RoleHooks";
import { getHeaderMenuItems, getHeaderRightMenuItems } from "../../config/navigation";
import { getSidebarData } from "../../Layout/VerticalLayout/SidebarData";

/**
 * Test component to verify role-based navigation filtering
 */
const NavigationTest = () => {
  const { userRole } = useRoleAccess();

  // Get role-based navigation items
  const headerMenuItems = getHeaderMenuItems(userRole);
  const headerRightMenuItems = getHeaderRightMenuItems(userRole);
  const sidebarData = getSidebarData(userRole);

  return (
    <div className="card">
      <div className="card-header">
        <h4>Navigation Test - Current Role: {userRole || "Not logged in"}</h4>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            <h5>Header Menu Items</h5>
            <ul className="list-group">
              {headerMenuItems.map((item, index) => (
                <li key={index} className="list-group-item">
                  {item.label} ({item.id})
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-4">
            <h5>Header Right Menu Items</h5>
            <ul className="list-group">
              {headerRightMenuItems.map((item, index) => (
                <li key={index} className="list-group-item">
                  {item.label} ({item.id})
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-4">
            <h5>Sidebar Items</h5>
            <ul className="list-group">
              {sidebarData.map((item, index) => (
                <li key={index} className="list-group-item">
                  {item.label} {item.url && `(${item.url})`}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-3">
          <h5>Expected Behavior for Doctor Role:</h5>
          <ul>
            <li>✅ Dashboard should be visible</li>
            <li>✅ Patients should be visible</li>
            <li>❌ Doctors should be hidden</li>
            <li>❌ Settings should be hidden (from both header and right menu)</li>
            <li>✅ Notifications should be visible</li>
            <li>✅ My Account should be visible</li>
            <li>✅ Logout should be visible</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavigationTest; 
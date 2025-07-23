import { hasRouteAccess } from "../config/roleAccess";

/**
 * Filters navigation items based on user role
 * @param {Array} menuItems - Array of menu items
 * @param {string} userRole - User's role
 * @returns {Array} Filtered menu items
 */
export const filterMenuItemsByRole = (menuItems, userRole) => {
  if (!userRole) return [];

  return menuItems.filter(item => {
    // Check if the main menu item is accessible
    const hasMainAccess = hasRouteAccess(item.url, userRole);
    
    // If there are sub-items, filter them too
    if (item.navbarItems && item.navbarItems.length > 0) {
      const accessibleSubItems = item.navbarItems.filter(subItem => 
        hasRouteAccess(subItem.url, userRole)
      );
      
      // Only show menu item if it has accessible sub-items or main access
      return hasMainAccess || accessibleSubItems.length > 0;
    }
    
    return hasMainAccess;
  }).map(item => {
    // If item has sub-items, filter them
    if (item.navbarItems && item.navbarItems.length > 0) {
      return {
        ...item,
        navbarItems: item.navbarItems.filter(subItem => 
          hasRouteAccess(subItem.url, userRole)
        )
      };
    }
    
    return item;
  });
};

/**
 * Gets accessible navigation items for a specific role
 * @param {string} userRole - User's role
 * @returns {Object} Object containing filtered header and right menu items
 */
export const getRoleBasedNavigation = (userRole) => {
  // Import navigation items dynamically to avoid circular dependencies
  const { headerMenuItems, headerRightMenuItems } = require("../config/navigation");
  
  return {
    headerMenuItems: filterMenuItemsByRole(headerMenuItems, userRole),
    headerRightMenuItems: filterMenuItemsByRole(headerRightMenuItems, userRole)
  };
}; 
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  headerMenuItems, 
  headerRightMenuItems, 
  getHeaderMenuItems, 
  getHeaderRightMenuItems 
} from "../../config/navigation";
import {
  setActiveHeaderMenu,
  setNavbarMenuItems,
} from "../../store/navigation/actions";
import { isPathActive } from '../../utils/pathMatch';
import HelpMobilePanel from "./HelpMobilePanel";
import { logoutUser } from '../../store/auth/login/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useRoleAccess } from '../../Hooks/RoleHooks';
import { useMemo } from 'react';

//import images
import logoSm from "../../assets/images/logo-sm.png";
import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-light.png";

// Redux Store
import { toggleLeftmenu } from "../../store/actions";

const Header = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
     const [helpPanelOpen, setHelpPanelOpen] = useState(false);
   const [isSoundMuted, setIsSoundMuted] = useState(() => {
     const stored = localStorage.getItem('notificationSoundMuted');
     return stored ? JSON.parse(stored) : true; // Initially muted
   });
   const [showSoundTooltip, setShowSoundTooltip] = useState(false);
   const dispatch = useDispatch();
   const { userRole } = useRoleAccess();

  // Get role-based navigation items (memoized to prevent infinite loops)
  const roleBasedHeaderMenuItems = useMemo(() => getHeaderMenuItems(userRole), [userRole]);
  const roleBasedHeaderRightMenuItems = useMemo(() => getHeaderRightMenuItems(userRole), [userRole]);

  // Get unread notifications count from Redux
  const notificationCount = useSelector(state => state.notifications?.notificationCount);
  const unreadCount = useSelector(state => {
    const notifications = state.notifications?.notifications || [];
    const count = notifications.filter(n => !n.read_at).length;
    return count;
  });
  const badgeCount = typeof notificationCount === 'number' ? notificationCount : unreadCount;

  // Sync navbarMenuItems with current route on load/route change
  useEffect(() => {
    // Find the active header menu based on the current route
    let activeMenu = roleBasedHeaderMenuItems.find(
      (menu) =>
        menu.navbarItems &&
        menu.navbarItems.some((sub) => location.pathname.startsWith(sub.url))
    );
    
    // If not found, check if the current route matches the main menu's own URL (e.g., /dashboard)
    if (!activeMenu) {
      activeMenu = roleBasedHeaderMenuItems.find((menu) =>
        menu.url && location.pathname === menu.url
      );
    }
    
    // If still not found, check if the current route matches the main menu's own URL (e.g., /quick-replies)
    if (!activeMenu) {
      activeMenu = roleBasedHeaderMenuItems.find((menu) =>
        location.pathname.startsWith(`/${menu.id}`)
      );
    }
    
    // Special case: if on a patient detail route, set patient-detail menu as active
    if (!activeMenu && /^\/patients\/[\w-]+$/.test(location.pathname)) {
      activeMenu = roleBasedHeaderMenuItems.find((menu) => menu.id === "patient-detail");
    }
    
    if (activeMenu) {
      let navItems = Array.isArray(activeMenu.navbarItems)
        ? activeMenu.navbarItems
        : [];
      const uniqueUrls = [...new Set(navItems.map((item) => item.url))];
      if (uniqueUrls.length === 1 && uniqueUrls[0] === `/${activeMenu.id}`) {
        navItems = [];
      }
      // If the current route matches the main menu's own URL (and not a submenu), clear navItems
      if (
        location.pathname.startsWith(`/${activeMenu.id}`) &&
        (!activeMenu.navbarItems ||
          activeMenu.navbarItems.length === 0 ||
          navItems.length === 0)
      ) {
        navItems = [];
      }
      props.setActiveHeaderMenu(activeMenu);
      props.setNavbarMenuItems(navItems);
      console.log(
        "Setting navbarMenuItems:",
        navItems,
        "for menu:",
        activeMenu?.id
      );
    } else {
      // If no menu matches, clear navbarMenuItems
      props.setNavbarMenuItems([]);
    }
  }, [location.pathname, userRole]);

  const handleMenuClick = (menu) => {
    props.setActiveHeaderMenu(menu);
    let navItems = Array.isArray(menu.navbarItems) ? menu.navbarItems : [];
    const uniqueUrls = [...new Set(navItems.map((item) => item.url))];
    if (uniqueUrls.length === 1 && uniqueUrls[0] === `/${menu.id}`) {
      navItems = [];
    }
    props.setNavbarMenuItems(navItems);
    // Navigate to the first sub nav item's URL if it exists, otherwise to the main menu page
    if (navItems && navItems.length > 0) {
      navigate(navItems[0].url);
    } else {
      navigate(`/${menu.id}`);
    }
  };

  // Find which menu is active based on the current route
  const getMenuIsActive = (menu) => {
    // Check if the menu has a direct URL that matches the current pathname
    if (menu.url && (location.pathname === menu.url || location.pathname.startsWith(menu.url + '/'))) {
      return true;
    }
    if (!menu.navbarItems) return false;
    // For patient-list and patient-detail, use robust path matching
    if (menu.id === 'patients') {
      // Mark as active for any /patients route (including /patients/:id/...)
      return location.pathname.startsWith('/patients/');
    }
    return menu.navbarItems.some((sub) => isPathActive(location.pathname, sub.url));
  };

     // Determine if a right-side menu is active
   const getRightMenuIsActive = (menu) => {
     if (menu.id === 'logout') return false; // Never active
     if (menu.id === 'help') return helpPanelOpen; // Active if help panel is open
     // For others, active if current route matches or starts with menu.url
     if (menu.url && (location.pathname === menu.url || location.pathname.startsWith(menu.url + '/'))) {
       return true;
     }
     return false;
   };

   // Get appropriate Font Awesome icon for each menu
   const getMenuIcon = (menuId) => {
     const iconMap = {
       'dashboard': 'fas fa-tachometer-alt',
       'patients': 'fas fa-users',
       'patient-detail': 'fas fa-user-md',
       'orders': 'fas fa-shopping-cart',
       'doctors': 'fas fa-user-md',
       'settings': 'fas fa-cog',
       'charts': 'fas fa-chart-bar',
       'forms': 'fas fa-wpforms',
       'tables': 'fas fa-table',
       'icons': 'fas fa-icons',
       'maps': 'fas fa-map-marker-alt',
       'email': 'fas fa-envelope',
       'calendar': 'fas fa-calendar-alt',
       'todo': 'fas fa-tasks',
       'quick-replies': 'fas fa-reply-all',
       'notifications': 'fas fa-bell',
       'help': 'fas fa-question-circle',
       'my-account':'fas fa-user-circle',
       'logout': 'fas fa-sign-out-alt'
     };
     return iconMap[menuId] || 'fas fa-circle';
   };

   // Handle sound toggle
   const toggleSound = () => {
     const newMutedState = !isSoundMuted;
     setIsSoundMuted(newMutedState);
     localStorage.setItem('notificationSoundMuted', JSON.stringify(newMutedState));
     setShowSoundTooltip(false);
   };

   // Show tooltip on first visit if sound is muted
   useEffect(() => {
     const hasShownTooltip = localStorage.getItem('hasShownSoundTooltip');
     if (!hasShownTooltip && isSoundMuted) {
       setTimeout(() => {
         setShowSoundTooltip(true);
         localStorage.setItem('hasShownSoundTooltip', 'true');
       }, 2000); // Show after 2 seconds
     }
   }, [isSoundMuted]);

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box text-center">
              <Link to="/dashboard" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logoSm} alt="logo-sm-dark" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logoDark} alt="logo-dark" height="34" />
                </span>
              </Link>

              <Link to="/dashboard" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoSm} alt="logo-sm-light" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logoLight} alt="logo-light" height="24" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              className="btn btn-sm px-3 font-size-16 d-lg-none header-item"
              data-toggle="collapse"
              onClick={() => {
                props.toggleLeftmenu(!props.leftMenu);
              }}
              data-target="#topnav-menu-content"
            >
              <i className="fa fa-fw fa-bars" />
            </button>

                         <div className="d-flex align-items-center">
               {roleBasedHeaderMenuItems.map((menu) => (
                 <button
                   key={menu.id}
                   type="button"
                   className={`btn header-item${
                     getMenuIsActive(menu) ? " active" : ""
                   }${menu.navbarItems && menu.navbarItems.length > 0 ? " has-submenu" : ""}`}
                   onClick={() => handleMenuClick(menu)}
                   style={{ 
                     position: 'relative',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '8px',
                     padding: '10px 16px'
                   }}
                 >
                   <i className={`${getMenuIcon(menu.id)}`} style={{ fontSize: '16px' }}></i>
                   {menu.label}
                 </button>
               ))}
             </div>
          </div>

                     <div className="d-flex">
             {/* Sound Control Button */}
             <div className="dropdown ms-3" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
               <button
                 type="button"
                 className="btn header-item"
                 onClick={toggleSound}
                 style={{
                   position: 'relative',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '6px',
                   padding: '8px 12px',
                   borderRadius: '50%',
                   width: '40px',
                   height: '40px',
                   justifyContent: 'center'
                 }}
                 title={isSoundMuted ? "Unmute notifications" : "Mute notifications"}
               >
                 <i 
                   className={isSoundMuted ? "fas fa-volume-mute" : "fas fa-volume-up"} 
                   style={{ fontSize: '14px', color: isSoundMuted ? '#6c757d' : '#28a745' }}
                 ></i>
               </button>
               
               {/* Tooltip */}
               {showSoundTooltip && (
                 <div 
                   style={{
                     position: 'absolute',
                     top: '50px',
                     right: '0',
                     backgroundColor: '#333',
                     color: 'white',
                     padding: '8px 12px',
                     borderRadius: '6px',
                     fontSize: '12px',
                     whiteSpace: 'nowrap',
                     zIndex: 1000,
                     boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                     animation: 'fadeIn 0.3s ease-in-out'
                   }}
                 >
                   <div style={{ marginBottom: '8px' }}>
                     <strong>Notification Sound</strong>
                   </div>
                   <div style={{ marginBottom: '8px', fontSize: '11px' }}>
                     Click to enable notification sounds for important updates
                   </div>
                   <div style={{ display: 'flex', gap: '8px' }}>
                     <button
                       onClick={toggleSound}
                       style={{
                         background: '#28a745',
                         border: 'none',
                         color: 'white',
                         padding: '4px 8px',
                         borderRadius: '4px',
                         fontSize: '11px',
                         cursor: 'pointer'
                       }}
                     >
                       Enable
                     </button>
                     <button
                       onClick={() => setShowSoundTooltip(false)}
                       style={{
                         background: '#6c757d',
                         border: 'none',
                         color: 'white',
                         padding: '4px 8px',
                         borderRadius: '4px',
                         fontSize: '11px',
                         cursor: 'pointer'
                       }}
                     >
                       Dismiss
                     </button>
                   </div>
                   <div 
                     style={{
                       position: 'absolute',
                       top: '-5px',
                       right: '10px',
                       width: '0',
                       height: '0',
                       borderLeft: '5px solid transparent',
                       borderRight: '5px solid transparent',
                       borderBottom: '5px solid #333'
                     }}
                   ></div>
                 </div>
               )}
             </div>

             {/* Right-side header menus from config */}
             {roleBasedHeaderRightMenuItems.map((menu) => (
               <div className="dropdown ms-3" key={menu.id} style={{ display: 'flex', alignItems: 'center' }}>
                {menu.id === 'logout' ? (
                  // Special styling for logout button
                                     <button
                     type="button"
                     className="btn btn-danger"
                     id={`page-header-${menu.id}-dropdown`}
                     onClick={() => {
                       dispatch(logoutUser());
                       navigate('/auth-login');
                     }}
                     style={{
                       position: 'relative',
                       borderRadius: '20px',
                       padding: '8px 16px',
                       fontSize: '14px',
                       fontWeight: '500',
                       border: 'none',
                       boxShadow: '0 2px 4px rgba(220, 53, 69, 0.3)',
                       transition: 'all 0.2s ease-in-out',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '6px',
                       alignSelf: 'center',
                       margin: 'auto 0'
                     }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 4px rgba(220, 53, 69, 0.3)';
                    }}
                  >
                    <i className="mdi mdi-logout" style={{ fontSize: '16px' }}></i>
                    {menu.label}
                  </button>
                ) : (
                  // Regular styling for other menu items
                                     <button
                     type="button"
                     className={`btn header-item${getRightMenuIsActive(menu) ? ' active' : ''}`}
                     id={`page-header-${menu.id}-dropdown`}
                     onClick={() => {
                       if (menu.id === 'help') {
                         setHelpPanelOpen(true);
                       } else {
                         navigate(menu.url);
                       }
                     }}
                     style={{ 
                       position: 'relative',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '6px',
                       padding: '8px 12px'
                     }}
                   >
                     <i className={`${getMenuIcon(menu.id)}`} style={{ fontSize: '14px' }}></i>
                     {menu.label}
                    {menu.id === 'notifications' && badgeCount > 0 && (
                      <span className="badge bg-danger rounded-pill notification-badge" style={{left:"3px"}}>
                        {badgeCount}
                      </span>
                    )}
                    {menu.id !== 'notifications' && menu.badge && (
                      <span style={{
                        display: 'inline-block',
                        background: '#ef5350',
                        color: 'white',
                        borderRadius: '999px',
                        fontSize: '13px',
                        fontWeight: 600,
                        minWidth: 20,
                        height: 20,
                        lineHeight: '20px',
                        textAlign: 'center',
                        marginLeft: 8,
                        verticalAlign: 'middle',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                      }}>{menu.badge}</span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>
      {helpPanelOpen && (
        <HelpMobilePanel userName="Abid" onClose={() => setHelpPanelOpen(false)} />
      )}
    </React.Fragment>
  );
};

Header.propTypes = {
  leftMenu: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
  activeHeaderMenu: PropTypes.any,
  setActiveHeaderMenu: PropTypes.func,
  setNavbarMenuItems: PropTypes.func,
};

const mapStatetoProps = (state) => {
  const { leftMenu } = state.Layout;
  const { activeHeaderMenu } = state.Navigation;
  return { leftMenu, activeHeaderMenu };
};

export default connect(mapStatetoProps, {
  toggleLeftmenu,
  setActiveHeaderMenu,
  setNavbarMenuItems,
})(Header);

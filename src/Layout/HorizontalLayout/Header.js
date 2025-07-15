import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { headerMenuItems, headerRightMenuItems } from "../../config/navigation";
import {
  setActiveHeaderMenu,
  setNavbarMenuItems,
} from "../../store/navigation/actions";
import { isPathActive } from '../../utils/pathMatch';
import HelpMobilePanel from "./HelpMobilePanel";
import { logoutUser } from '../../store/auth/login/actions';
import { useDispatch, useSelector } from 'react-redux';

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
  const dispatch = useDispatch();

  // Get unread notifications count from Redux
  const unreadCount = useSelector(state => {
    const notifications = state.notifications?.notifications || [];
    return notifications.filter(n => !n.read_at).length;
  });

  // Sync navbarMenuItems with current route on load/route change
  useEffect(() => {
    // Find the active header menu based on the current route
    let activeMenu = headerMenuItems.find(
      (menu) =>
        menu.navbarItems &&
        menu.navbarItems.some((sub) => location.pathname.startsWith(sub.url))
    );
    
    // If not found, check if the current route matches the main menu's own URL (e.g., /dashboard)
    if (!activeMenu) {
      activeMenu = headerMenuItems.find((menu) =>
        menu.url && location.pathname === menu.url
      );
    }
    
    // If still not found, check if the current route matches the main menu's own URL (e.g., /quick-replies)
    if (!activeMenu) {
      activeMenu = headerMenuItems.find((menu) =>
        location.pathname.startsWith(`/${menu.id}`)
      );
    }
    
    // Special case: if on a patient detail route, set patient-detail menu as active
    if (!activeMenu && /^\/patients\/[\w-]+$/.test(location.pathname)) {
      activeMenu = headerMenuItems.find((menu) => menu.id === "patient-detail");
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
  }, [location.pathname]);

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
              {headerMenuItems.map((menu) => (
                <button
                  key={menu.id}
                  type="button"
                  className={`btn header-item${
                    getMenuIsActive(menu) ? " active" : ""
                  }${menu.navbarItems && menu.navbarItems.length > 0 ? " has-submenu" : ""}`}
                  onClick={() => handleMenuClick(menu)}
                  style={{ position: 'relative' }}
                >
                  {menu.label}
                </button>
              ))}
            </div>
          </div>

          <div className="d-flex">
            {/* Right-side header menus from config */}
            {headerRightMenuItems.map((menu) => (
              <div className="dropdown d-inline-block ms-3" key={menu.id}>
                <button
                  type="button"
                  className={`btn header-item${getRightMenuIsActive(menu) ? ' active' : ''}`}
                  id={`page-header-${menu.id}-dropdown`}
                  onClick={() => {
                    if (menu.id === 'help') {
                      setHelpPanelOpen(true);
                    } else if (menu.id === 'logout') {
                      dispatch(logoutUser());
                      navigate('/auth-login');
                    } else {
                      navigate(menu.url);
                    }
                  }}
                  style={{ position: 'relative' }}
                >
                  {menu.label}
                  {menu.id === 'notifications' && unreadCount > 0 && (
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
                    }}>{unreadCount}</span>
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

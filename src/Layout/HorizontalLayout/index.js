import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import withRouter from "../../components/Common/withRouter";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { headerMenuItems } from "../../config/navigation";
import {
  setActiveHeaderMenu,
  setNavbarMenuItems,
} from "../../store/navigation/actions";

//actions
import {
  changeLayout,
  changeLayoutMode,
  changeTopbarTheme,
  changeLayoutWidth,
  showRightSidebarAction,
} from "../../store/actions";

//redux
import { useSelector } from "react-redux";

//components
import Navbar from "./NavBar";
import Header from "./Header";
import Footer from "./Footer";
import RightSidebar from "../../components/Common/RightSideBar";

import { createSelector } from "reselect";

function useSyncNavigationWithRoute() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Find which header menu matches the current path
    let foundMenu = null;
    let foundSubMenu = null;
    for (const menu of headerMenuItems) {
      if (menu.navbarItems) {
        for (const sub of menu.navbarItems) {
          if (location.pathname.startsWith(sub.url)) {
            foundMenu = menu;
            foundSubMenu = sub;
            break;
          }
        }
      }
      if (foundMenu) break;
    }
    // Fallback to first menu if nothing matches
    if (!foundMenu) {
      // foundMenu = headerMenuItems[0];
      foundMenu = {};
    }
    dispatch(setActiveHeaderMenu(foundMenu));
    dispatch(setNavbarMenuItems(foundMenu.navbarItems || []));
  }, [location, dispatch]);
}

const Layout = (props) => {
  const dispatch = useDispatch();

  const horizontallayout = createSelector(
    (state) => state.Layout,
    (layout) => ({
      topbarTheme: layout.topbarTheme,
      layoutWidth: layout.layoutWidth,
      showRightSidebar: layout.showRightSidebar,
      layoutModeTypes: layout.layoutModeTypes,
    })
  );
  // Inside your component
  const { topbarTheme, layoutWidth, showRightSidebar, layoutModeTypes } =
    useSelector(horizontallayout);
  const navbarMenuItems = useSelector(
    (state) => state.Navigation.navbarMenuItems
  );

  /*
  document title
  */
  useEffect(() => {
    const title = props.router.location.pathname;
    let currentage = title.charAt(1).toUpperCase() + title.slice(2);

    document.title = currentage + " | Smileie - Smileie System";
  }, [props.router.location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //hides right sidebar on body click
  const hideRightbar = useCallback(
    (event) => {
      var rightbar = document.getElementById("right-bar");
      //if clicked in inside right bar, then do nothing
      if (rightbar && rightbar.contains(event.target)) {
        return;
      } else {
        //if clicked in outside of rightbar then fire action for hide rightbar
        dispatch(showRightSidebarAction(false));
      }
    },
    [dispatch]
  );

  /*
  layout settings
  */
  useEffect(() => {
    dispatch(changeLayout("horizontal"));
  }, [dispatch]);

  useEffect(() => {
    //init body click event fot toggle rightbar
    document.body.addEventListener("click", hideRightbar, true);
  }, [hideRightbar]);

  useEffect(() => {
    if (layoutModeTypes) {
      dispatch(changeLayoutMode(layoutModeTypes));
    }
  }, [dispatch, layoutModeTypes]);

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [dispatch, topbarTheme]);

  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [dispatch, layoutWidth]);

  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const openMenu = () => {
    setIsMenuOpened(!isMenuOpened);
  };

  useSyncNavigationWithRoute();

  console.log("navbarMenuItems =|>", navbarMenuItems);

  return (
    <React.Fragment>
      <div id="layout-wrapper">
        <Header
          theme={topbarTheme}
          isMenuOpened={isMenuOpened}
          openLeftMenuCallBack={openMenu}
        />
        {navbarMenuItems && navbarMenuItems.length > 0 && <Navbar />}
        <div className="main-content">{props.children}</div>
      </div>

      {showRightSidebar ? <RightSidebar /> : null}
    </React.Fragment>
  );
};

Layout.propTypes = {
  changeLayout: PropTypes.func,
  changeLayoutMode: PropTypes.func,
  changeLayoutWidth: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  layoutWidth: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
};

export default withRouter(Layout);

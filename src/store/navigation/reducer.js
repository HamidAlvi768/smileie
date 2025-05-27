import { SET_ACTIVE_HEADER_MENU, SET_NAVBAR_MENU_ITEMS } from "./actionTypes";

const INIT_STATE = {
  activeHeaderMenu: null,
  navbarMenuItems: [],
};

const Navigation = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_ACTIVE_HEADER_MENU:
      return {
        ...state,
        activeHeaderMenu: action.payload,
      };
    case SET_NAVBAR_MENU_ITEMS:
      return {
        ...state,
        navbarMenuItems: action.payload,
      };
    default:
      return state;
  }
};

export default Navigation; 
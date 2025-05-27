import { SET_ACTIVE_HEADER_MENU, SET_NAVBAR_MENU_ITEMS } from "./actionTypes";

export const setActiveHeaderMenu = (menu) => ({
  type: SET_ACTIVE_HEADER_MENU,
  payload: menu,
});

export const setNavbarMenuItems = (items) => ({
  type: SET_NAVBAR_MENU_ITEMS,
  payload: items,
}); 
// List of routes that should not have a navbar
const noNavbarRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/error-404',
    '/error-500',
    '/maintenance',
    '/coming-soon'
];

/**
 * Check if the current route should have a navbar
 * @param {string} currentPath - The current route path
 * @returns {boolean} - True if the route should have a navbar, false otherwise
 */
export const shouldHaveNavbar = (currentPath) => {
    return !noNavbarRoutes.some(route => currentPath.startsWith(route));
};

export default shouldHaveNavbar; 
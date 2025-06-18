export function isPathActive(currentPath, basePath) {
  return currentPath === basePath || currentPath.startsWith(basePath + '/');
} 
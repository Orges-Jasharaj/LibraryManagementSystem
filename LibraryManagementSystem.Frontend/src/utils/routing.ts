export function getHomeRoute(roles: string[]) {
  return roles.includes('Admin') ? '/admin' : '/library';
}

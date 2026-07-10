/* eslint-disable @typescript-eslint/no-empty-interface */
/* Declarations for modules that are not present in the repo but are used
   by the frontend code. Declaring them as `any` silences TS errors without
   pulling in external packages. */
declare module '@material-tailwind/react' {
  const value: any;
  export default value;
}
declare module '@tanstack/react-query' {
  const value: any;
  export default value;
}
declare module 'axios' {
  const value: any;
  export default value;
}
declare module '@mui/material' {
  const value: any;
  export default value;
}
declare module '../../../../src/backend/shared/services/PermissionService' {
  const PermissionService: any;
  export default PermissionService;
}
declare module '../../Common/Layout' {
  const Layout: any;
  export default Layout;
}

// Declarations for modules that are not present in the repository.
// They are intentionally empty  only needed to satisfy the TypeScript compiler.
declare module 'axios' {
  const axios: any;
  export default axios;
}
declare module 'react-toastify' {
  export const toast: any;
}
declare module 'next/router' {
  export const useRouter: any;
}
declare module '@fluentui/react-components' {
  export const Button: any;
}
declare module '../../../shared/types/database.types' {
  export const UserDetail: any;
  export const UserPreferences: any;
  export const UserSecurity: any;
  export const ActivitySummary: any;
}

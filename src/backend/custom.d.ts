/* eslint-disable */
// Ambient module declarations required for backend compilation.
// Relative paths are NOT allowed in ambient declarations, so we expose
// simple module names that match the import statements used in the code.
declare module '@azure/functions' {
  // Minimal stubs for the Azure Functions types used in the project.
  export type AzureFunction = (...args: any[]) => any;
  export type Context = any;
  export type HttpRequest = any;
}
declare module 'jsonwebtoken';
declare module 'typeorm';
declare module 'config';
declare module 'utils/auth';
declare module 'models/UserPreferences';
declare module 'models/UserActivity';
declare module 'models/UserRole';

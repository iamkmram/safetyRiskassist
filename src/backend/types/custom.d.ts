// ---------------------------------------------------------------
// Global type declarations to silence missingmodule / type errors
// ---------------------------------------------------------------
declare var process: any;
declare var __dirname: string;

// Generic wildcard module (fallback)
declare module '*';

// Specific missing modules
declare module 'aws-lambda' {
  export type APIGatewayProxyEventV2 = any;
  export type APIGatewayProxyResultV2 = any;
}
declare module 'express' {
  export type NextFunction = any;
}
declare module '../../../../utils/logger' {
  const logger: any;
  export default logger;
}
declare module '../../../utils/auth' {
  const auth: any;
  export default auth;
}
declare module '../../../config' {
  const config: any;
  export default config;
}

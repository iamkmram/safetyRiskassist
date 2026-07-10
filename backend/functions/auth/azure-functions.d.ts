declare module '@azure/functions' {
  export type AzureFunction = (...args: any[]) => any;
  export interface Context { [key: string]: any; }
  export interface HttpRequest { [key: string]: any; }
}

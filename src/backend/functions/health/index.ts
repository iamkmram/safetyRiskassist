/* eslint-disable */
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const healthCheck: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: { status: "ok" },
  };
};

export default healthCheck;

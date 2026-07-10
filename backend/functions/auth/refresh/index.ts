import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  // TODO: Implement token refresh logic
  context.res = {
    status: 200,
    body: { message: "Refresh stub response" }
  };
};

export default httpTrigger;

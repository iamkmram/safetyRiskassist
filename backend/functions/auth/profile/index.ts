import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  // TODO: Implement user profile retrieval
  context.res = {
    status: 200,
    body: { message: "Profile stub response" }
  };
};

export default httpTrigger;

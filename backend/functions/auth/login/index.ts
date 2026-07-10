import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  // TODO: Implement Azure AD login flow, issue JWT
  context.res = {
    status: 200,
    body: { message: "Login stub response" }
  };
};

export default httpTrigger;

// @ts-nocheck
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AuthService } from "../../../shared/services/AuthService";

/**
 * HTTP trigger for the Azure AD login flow.
 * Expected query param: ?code=AUTHORIZATION_CODE
 *
 * For this prototype we mock the token exchange - a static response is returned.
 */
const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  const code = req.query?.code as string | undefined;

  if (!code) {
    context.res = {
      status: 400,
      body: { error: "Missing 'code' query parameter." },
    };
    return;
  }

  try {
    // In a real implementation we would POST to the Azure token endpoint.
    // Here we simulate the exchange.
    const tokenResponse = await AuthService.exchangeCode(code);

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: tokenResponse,
    };
  } catch (error: any) {
    context.res = {
      status: 400,
      body: { error: error?.message ?? "Invalid authorization code" },
    };
  }
};

export default httpTrigger;

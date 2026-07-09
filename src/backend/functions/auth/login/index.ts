import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DatabaseService } from '../../../../backend/shared/services/DatabaseService';

const db = new DatabaseService();

export const handler = async (
  _event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const loginUrl = process.env.AZURE_AD_LOGIN_URL ?? '';
    return {
      statusCode: 200,
      body: JSON.stringify({ url: loginUrl }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('Login URL fetch error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

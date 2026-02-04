// GraphQL client for WooCommerce
import { getWordPressGraphqlUrl } from '@/lib/config/wordpress';

const GRAPHQL_ENDPOINT = getWordPressGraphqlUrl();

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors) {
    console.error('GraphQL errors:', json.errors);
    throw new Error(json.errors[0]?.message || 'GraphQL request failed');
  }

  if (!json.data) {
    throw new Error('No data returned from GraphQL');
  }

  return json.data;
}

export async function fetchGraphQLAuth<T>(
  query: string,
  variables: Record<string, unknown> | undefined,
  token: string
): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: 'no-store',
  });

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors) {
    console.error('GraphQL errors:', json.errors);
    throw new Error(json.errors[0]?.message || 'GraphQL request failed');
  }

  if (!json.data) {
    throw new Error('No data returned from GraphQL');
  }

  return json.data;
}
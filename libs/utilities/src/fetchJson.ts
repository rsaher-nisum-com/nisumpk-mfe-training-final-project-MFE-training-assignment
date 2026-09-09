export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

/**
 * Thin fetch wrapper every MFE uses to talk to the backend API. Centralizes
 * error normalization (network failure vs. non-2xx vs. bad JSON) so each
 * feature hook only has to render three states: loading / error / data.
 */
export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(input, {
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      ...init,
    });
  } catch {
    throw new ApiRequestError('Network error: could not reach the backend API.', 0);
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch {
      // response had no JSON body; keep the generic message
    }
    throw new ApiRequestError(message, response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiRequestError('Received an invalid response from the backend API.', response.status);
  }
}

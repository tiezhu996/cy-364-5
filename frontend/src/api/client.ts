import { API_BASE_URL } from "../constants/app";
import type { OverviewResponse } from "../types";

export async function fetchOverview(owner?: string, priority?: string): Promise<OverviewResponse> {
  const params = new URLSearchParams();
  if (owner) params.append("owner", owner);
  if (priority) params.append("priority", priority);

  const url = params.toString()
    ? `${API_BASE_URL}/overview?${params.toString()}`
    : `${API_BASE_URL}/overview`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Overview request failed: ${response.status}`);
  }

  return response.json() as Promise<OverviewResponse>;
}

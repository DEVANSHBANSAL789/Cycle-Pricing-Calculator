const BASE_URL = "/api";

export async function fetchParts() {
  const response = await fetch(`${BASE_URL}/parts`);
  if (!response.ok) {
    throw new Error("Failed to load parts from the server.");
  }
  return response.json();
}

export async function calculatePrice(partIds, date) {
  const response = await fetch(`${BASE_URL}/calculate-price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, parts: partIds }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to calculate price.");
  }

  return data;
}
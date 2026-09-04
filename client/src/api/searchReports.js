const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const searchReports = async (searchTerm, signal) => {
  const query = searchTerm.trim();

  const response = await fetch(
    `${API_URL}/api/reports?search=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search reports");
  }

  return await response.json();
};
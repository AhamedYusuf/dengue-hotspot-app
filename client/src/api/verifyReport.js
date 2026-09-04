const API_BASE_URL = import.meta.env.VITE_API_URL || "";

async function verifyReport(reportId) {
    if (!reportId) {
        throw new Error("Report ID is required.");
    }

    const response = await fetch(`${API_BASE_URL}/api/reports/${encodeURIComponent(reportId)}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    });

    let data = null;

    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }

    if (!response.ok) {
        throw new Error(data?.message || "Unable to verify this report. Please try again.");
    }

    return data;
}

export default verifyReport;
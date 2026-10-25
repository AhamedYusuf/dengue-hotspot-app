import re
from datetime import datetime, timedelta
from bson import ObjectId

KNOWN_AREAS = [
    "Nugegoda", "Colombo", "Kandy", "Gampaha", "Kalutara", "Kurunegala",
    "Galle", "Matara", "Jaffna", "Anuradhapura", "Ratnapura", "Badulla",
    "Dehiwala", "Kaduwela", "Moratuwa", "Negombo", "Batticaloa", "Trincomalee"
]

def make_tools(db, report_id: str):
    """Return a list of tool functions bound to this specific report and database."""

    def search_similar_reports(area: str, date: str) -> dict:
        """Find other dengue reports from the same area within +/- 3 days of the given date, excluding this report itself."""
        target = datetime.fromisoformat(date)
        from_date = target - timedelta(days=3)
        to_date = target + timedelta(days=3)
        cursor = db.reports.find(
            {
                "_id": {"$ne": ObjectId(report_id)},
                "area": {"$regex": f"^{re.escape(area)}$", "$options": "i"},
                "date": {"$gte": from_date, "$lte": to_date},
            },
            {"area": 1, "date": 1, "caseCount": 1, "status": 1},
        )
        matches = []
        for m in cursor:
            matches.append({
                "area": m["area"],
                "date": m["date"].isoformat() if hasattr(m["date"], "isoformat") else str(m["date"]),
                "caseCount": m["caseCount"],
                "status": m.get("status"),
            })
        return {"matchCount": len(matches), "matches": matches}

    def get_area_history(area: str) -> dict:
        """Get this area's total report count, verified/rejected counts, and average case count."""
        reports = list(db.reports.find(
            {"area": {"$regex": f"^{re.escape(area)}$", "$options": "i"}},
            {"status": 1, "caseCount": 1},
        ))
        verified = sum(1 for r in reports if r.get("status") == "verified")
        rejected = sum(1 for r in reports if r.get("status") == "rejected")
        avg_case_count = (
            sum(r["caseCount"] for r in reports) / len(reports) if reports else None
        )
        return {
            "totalReports": len(reports),
            "verified": verified,
            "rejected": rejected,
            "avgCaseCount": avg_case_count,
        }

    def check_case_count_plausibility(area: str, case_count: int) -> dict:
        """Check whether the submitted case count is plausible given the area's history."""
        history = get_area_history(area)
        if history["totalReports"] < 2 or history["avgCaseCount"] is None:
            return {"plausible": True, "note": "Not enough history for this area to compare."}
        ratio = case_count / history["avgCaseCount"]
        return {
            "plausible": ratio <= 3,
            "areaAverage": history["avgCaseCount"],
            "submittedCount": case_count,
            "note": (
                "Submitted count is more than 3x the area average — worth a closer look."
                if ratio > 3 else "In line with area history."
            ),
        }

    def check_area_exists(area: str) -> dict:
        """Check whether the area name matches a known locality."""
        normalized_input = area.lower()
        known = any(
            a.lower() == normalized_input or a.lower() in normalized_input
            for a in KNOWN_AREAS
        )
        return {
            "recognized": known,
            "note": "Matches a known area." if known else "Not in the known area list — could be a typo or an untracked locality.",
        }

    return [search_similar_reports, get_area_history, check_case_count_plausibility, check_area_exists]

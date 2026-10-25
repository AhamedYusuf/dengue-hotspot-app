import time
from db import get_db
from agent import run_verification_agent

POLL_INTERVAL_SECONDS = 60
BATCH_SIZE = 5

def process_pending_reports():
    db = get_db()
    pending = list(db.reports.find(
        {"status": "pending", "aiRecommendation": {"$exists": False}}
    ).limit(BATCH_SIZE))

    if pending:
        print(f"Found {len(pending)} pending report(s) awaiting AI verification.")

    for report in pending:
        try:
            print(f"Investigating report {report['_id']} ({report.get('area')})...")
            recommendation = run_verification_agent(db, report)
            db.reports.update_one(
                {"_id": report["_id"]},
                {"$set": {"aiRecommendation": recommendation}},
            )
            print(f"AI recommendation generated for report {report['_id']}: {recommendation['confidence']} confidence")
        except Exception as e:
            print(f"Error processing report {report['_id']}: {e}")

if __name__ == "__main__":
    print("Python verification agent service started.")
    print("Polling for pending reports without AI recommendations...")
    while True:
        try:
            process_pending_reports()
        except Exception as e:
            print(f"Polling loop encounter error: {e}")
        time.sleep(POLL_INTERVAL_SECONDS)

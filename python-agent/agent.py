import os
import re
from datetime import datetime, timezone
import google.generativeai as genai
from tools import make_tools

PROMPT_TEMPLATE = """You are assisting a health official in deciding whether to trust a dengue outbreak report. Investigate it using the tools available before concluding — do not guess. You must base every claim only on tool results, never invent data.

Report to investigate:
- Area: {area}
- Date: {date}
- Case count: {case_count}
- Notes: {notes}

Use the tools to check for duplicates, area history, case count plausibility, and whether the area is recognized. Then respond ONLY in this exact format, with no other text:

CONFIDENCE: <low|medium|high>
FLAGS: <comma-separated short flags, or "none">
REASONING: <2-3 sentences citing what the tools returned>
"""

def configure_genai():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key == "your-gemini-api-key":
        raise ValueError("GEMINI_API_KEY is not configured or still has the placeholder value in .env.")
    genai.configure(api_key=api_key)

def run_verification_agent(db, report: dict) -> dict:
    configure_genai()
    tools = make_tools(db, str(report["_id"]))
    model = genai.GenerativeModel(model_name="gemini-2.0-flash", tools=tools)
    chat = model.start_chat(enable_automatic_function_calling=True)

    report_date = report["date"]
    date_str = report_date.date().isoformat() if hasattr(report_date, "date") else str(report_date)[:10]

    prompt = PROMPT_TEMPLATE.format(
        area=report["area"],
        date=date_str,
        case_count=report["caseCount"],
        notes=report.get("notes") or "(none)",
    )

    response = chat.send_message(prompt)
    return parse_agent_output(response.text)

def parse_agent_output(text: str) -> dict:
    confidence_match = re.search(r"CONFIDENCE:\s*(\w+)", text, re.IGNORECASE)
    flags_match = re.search(r"FLAGS:\s*(.+)", text, re.IGNORECASE)
    reasoning_match = re.search(r"REASONING:\s*([\s\S]*)", text, re.IGNORECASE)

    raw_conf = confidence_match.group(1).lower() if confidence_match else "low"
    if raw_conf not in ["low", "medium", "high"]:
        confidence = "medium" if "med" in raw_conf else ("high" if "high" in raw_conf else "low")
    else:
        confidence = raw_conf

    flags_raw = flags_match.group(1).strip() if flags_match else "none"
    flags = [] if flags_raw.lower() == "none" else [f.strip() for f in flags_raw.split(",") if f.strip()]
    reasoning = reasoning_match.group(1).strip() if reasoning_match else "No reasoning returned."

    return {
        "confidence": confidence,
        "flags": flags,
        "reasoning": reasoning,
        "generatedAt": datetime.now(timezone.utc),
    }

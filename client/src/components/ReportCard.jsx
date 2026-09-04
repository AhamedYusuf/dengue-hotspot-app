import VerifyButton from "./VerifyButton";

function ReportCard({ report, onReportUpdate }) {
    if (!report) {
        return null;
    }

    const handleVerified = (updatedReport) => {
        if (typeof onReportUpdate === "function") {
            onReportUpdate(updatedReport);
        }
    };

    return (
        <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">{report.area || "Unknown area"}</h3>
                    <p className="text-sm text-slate-600">Cases: {report.caseCount ?? 0}</p>
                </div>
                <VerifyButton
                    reportId={report._id || report.id}
                    verified={Boolean(report.verified)}
                    onVerified={handleVerified}
                />
            </div>

            {report.notes ? <p className="text-sm text-slate-600">{report.notes}</p> : null}
        </article>
    );
}

export default ReportCard;

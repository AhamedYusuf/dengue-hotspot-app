import { useState } from "react";
import verifyReport from "../api/verifyReport";

function VerifyButton({ reportId, verified, onVerified }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isVerified, setIsVerified] = useState(Boolean(verified));

    const alreadyVerified = isVerified || Boolean(verified);

    const handleVerify = async () => {
        if (!reportId || isLoading || alreadyVerified) {
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const updatedReport = await verifyReport(reportId);
            setIsVerified(true);
            if (typeof onVerified === "function") {
                onVerified(updatedReport);
            }
        } catch (requestError) {
            setError(requestError?.message || "Unable to verify this report. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (alreadyVerified) {
        return (
            <span
                className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700"
                aria-live="polite"
            >
                ✓ Verified
            </span>
        );
    }

    return (
        <div className="flex flex-col items-start gap-2">
            <button
                type="button"
                onClick={handleVerify}
                disabled={isLoading || !reportId}
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                aria-live="polite"
            >
                {isLoading ? "Verifying..." : "Mark as verified"}
            </button>

            {error ? (
                <p className="text-sm text-red-600" aria-live="assertive">
                    {error}
                </p>
            ) : null}
        </div>
    );
}

export default VerifyButton;
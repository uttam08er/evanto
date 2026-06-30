import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authAPI } from "../../services/api";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); 

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    const verify = async () => {
      try {
        await authAPI.verifyEmail(token);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Verifying your email...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-500 mb-6">Your account is now active. You can login and start booking.</p>
            <Link to="/login" className="btn-primary inline-block">Login Now →</Link>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-500 mb-6">The link is invalid or has expired. Please register again.</p>
            <Link to="/register" className="btn-primary inline-block">Register Again</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;

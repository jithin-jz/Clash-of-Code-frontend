import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { challengesApi } from "../services/challengesApi";

const CertificateVerification = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const response = await challengesApi.verifyCertificate(certificateId);
        setCertificate(response.data);
      } catch (err) {
        setError("Certificate not found or invalid");
      } finally {
        setLoading(false);
      }
    };

    verifyCertificate();
  }, [certificateId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate?.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Invalid Certificate
          </h2>
          <p className="text-gray-400 mb-6">
            {error || "This certificate could not be verified."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const { certificate: certData } = certificate;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-6">
            <div className="flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h1 className="text-3xl font-bold text-white">
                Certificate Verified
              </h1>
            </div>
          </div>

          {/* Certificate Info */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Python Mastery Course
              </h2>
              <p className="text-gray-400">
                This certificate is authentic and verified
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Recipient</p>
                <p className="text-white font-semibold text-lg">
                  {certData.username}
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Issue Date</p>
                <p className="text-white font-semibold text-lg">
                  {new Date(certData.issued_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">
                  Challenges Completed
                </p>
                <p className="text-white font-semibold text-lg">
                  {certData.completion_count}
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Certificate ID</p>
                <p className="text-white font-mono text-sm break-all">
                  {certData.certificate_id}
                </p>
              </div>
            </div>

            {/* Certificate Image */}
            {certData.certificate_url && (
              <div className="mb-8">
                <img
                  src={certData.certificate_url}
                  alt="Certificate"
                  className="w-full rounded-lg shadow-lg border-4 border-yellow-500"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                Print Certificate
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Verified by Code of Clans Platform</p>
          <p className="mt-2">
            This certificate can be verified at any time using the QR code or
            certificate ID
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerification;

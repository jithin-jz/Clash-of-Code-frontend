import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { challengesApi } from "../services/challengesApi";

const CertificateModal = ({ isOpen, onClose, certificate }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await challengesApi.downloadCertificate();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate_${certificate.username}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download certificate:", error);
    } finally {
      setDownloading(false);
    }
  };

  if (!certificate) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-yellow-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-yellow-600 to-yellow-500 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="w-10 h-10 text-white mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      🎉 Congratulations!
                    </h2>
                    <p className="text-yellow-100 text-sm">
                      You've earned your certificate
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-yellow-200 transition p-2"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Certificate Info */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Python Mastery Course Certificate
                </h3>
                <p className="text-gray-400">
                  Issued on{" "}
                  {new Date(certificate.issued_date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>

              {/* Certificate Image */}
              {certificate.certificate_url && (
                <div className="mb-6">
                  <img
                    src={certificate.certificate_url}
                    alt="Certificate"
                    className="w-full rounded-lg shadow-2xl border-4 border-yellow-500"
                  />
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">
                    Challenges Completed
                  </p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {certificate.completion_count}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Status</p>
                  <p className="text-2xl font-bold text-green-500">
                    {certificate.is_valid ? "Verified" : "Invalid"}
                  </p>
                </div>
              </div>

              {/* Certificate ID */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <p className="text-gray-400 text-sm mb-2">
                  Certificate ID (for verification)
                </p>
                <p className="text-white font-mono text-sm break-all">
                  {certificate.certificate_id}
                </p>
              </div>

              {/* Verification URL */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <p className="text-gray-400 text-sm mb-2">Verification URL</p>
                <a
                  href={certificate.verification_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-500 hover:text-yellow-400 text-sm break-all underline"
                >
                  {certificate.verification_url}
                </a>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex-1 px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {downloading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download Certificate
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "My Python Mastery Certificate",
                        text: `I just completed the Python Mastery Course and earned my certificate!`,
                        url: certificate.verification_url,
                      });
                    } else {
                      navigator.clipboard.writeText(
                        certificate.verification_url,
                      );
                      alert("Verification link copied to clipboard!");
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share
                </button>
              </div>

              {/* Footer Note */}
              <p className="text-center text-gray-500 text-sm mt-6">
                This certificate can be verified using the QR code or
                verification link
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CertificateModal;

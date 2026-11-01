/**
 * Safely formats Nodemailer / SMTP errors for logging
 * without leaking sensitive passwords, tokens, or credentials.
 */
const formatSafeMailError = (error) => {
  if (!error || typeof error !== "object") {
    return String(error || "Unknown error");
  }

  const parts = [];

  if (error.name) {
    parts.push(`name: ${error.name}`);
  }

  if (error.code) {
    parts.push(`code: ${error.code}`);
  }

  if (error.command) {
    parts.push(`command: ${error.command}`);
  }

  if (error.responseCode) {
    parts.push(`responseCode: ${error.responseCode}`);
  }

  if (error.response) {
    const cleanResponse = String(error.response).replace(/[\r\n]+/g, " ").trim();
    parts.push(`response: "${cleanResponse}"`);
  } else if (error.message) {
    const cleanMessage = String(error.message).replace(/[\r\n]+/g, " ").trim();
    parts.push(`message: "${cleanMessage}"`);
  }

  return parts.join(", ") || "Unknown mail error";
};

module.exports = formatSafeMailError;


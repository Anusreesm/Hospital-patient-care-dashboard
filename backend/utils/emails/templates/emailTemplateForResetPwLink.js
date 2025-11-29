export const EmailTempForResetPw = ({ toEmail, name, role, resetLink }) => {
  const roleInfo =
    role !== "patient" ? `<p><strong>Role:</strong> ${role}</p>` : "";

  return {
    subject: "MedTech – Password Reset Request",
    text: `Hello ${name},\nUse this link to reset your password: ${resetLink}`,
    html: `
      <div style="font-family: Arial; color: #333;">
        <h2 style="color:#0a5f7b;">Reset Your MedTech Password</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password.</p>
        <p><strong>Email:</strong> ${toEmail}</p>
        ${roleInfo}
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}"
           style="background:#0a5f7b; color:#fff; padding:10px 20px; border-radius:5px; text-decoration:none;">
           Reset Password
        </a>
        <br/><br/>
        <p style="font-size:0.9em; color:#666;">If you didn't request this, please ignore this email.</p>
      </div>
    `
  };
};

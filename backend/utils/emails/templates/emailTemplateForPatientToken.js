const EmailTempForPatToken = ({ toEmail, patientToken }) => {
  const dashboardLink = process.env.CLIENT_URL;
  return {
    subject: 'MedTech – Your Patient Access Token',
    text: `Hello, your MedTech patient access token is: ${patientToken}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <img 
          src="https://static.vecteezy.com/system/resources/previews/011/640/711/original/simple-modern-hospital-logo-with-healthcare-medical-template-vector.jpg" 
          alt="MedTech" 
          style="width:150px; display:block; margin-bottom:20px;"
        />
        <h2 style="color: #0a5f7b;">Welcome to MedTech!</h2>
        <p>Hello,</p>
        <p>Your MedTech patient access token has been generated successfully.</p>
        <p><strong>Email:</strong> ${toEmail}</p>
        <p><strong>Access Token:</strong> ${patientToken}</p>
        <p>You can access your patient dashboard here: 
          <a href="${dashboardLink}" target="_blank" 
   style="display:inline-block; padding:10px 20px; background:#0a5f7b; color:white; text-decoration:none; border-radius:5px;">
   Access Dashboard
</a>

        </p>
        <br/>
        <p style="font-size: 0.9em; color: #555;">
          If you did not request this token or believe this email was sent in error, 
          please contact your administrator immediately.
        </p>
      </div>
    `
  };
};

export default EmailTempForPatToken;
const EmailTempForTempPw = ({ toEmail, tempPassword, role,name }) => {
    
   const dashboardLink = process.env.CLIENT_URL;
  // Only include role in email if not 'patient'
    const roleInfo = role !== 'patient' 
      ? `<p><strong>Role: </strong> ${role}</p>` 
      : '';
  

    return {
        subject: 'Welcome to MedTech – Your Temporary Password',
        text: `Hello, your temporary password is: ${tempPassword}`,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <img src="https://static.vecteezy.com/system/resources/previews/011/640/711/original/simple-modern-hospital-logo-with-healthcare-medical-template-vector.jpg" alt="MedTech" style="width:150px; display:block; margin-bottom:20px;"/>
          <h2 style="color: #0a5f7b;">Welcome to MedTech!</h2>
          <p>Hello ${name},</p>
          <p>Your account has been successfully created on the MedTech Dashboard.</p>
          <p><strong>Email:</strong> ${toEmail}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          ${roleInfo}
          <p>Please log in and change your password immediately for security purposes (do not share with anyone)</p>
             <a href="${dashboardLink}" target="_blank"  
   style="display:inline-block; padding:10px 20px; background:#0a5f7b; color:white; text-decoration:none; border-radius:5px;">Access your dashboard here: MedTech Login</a>
          <br/>
          <p style="font-size: 0.9em; color: #555;">If you did not expect this email, please contact your admin.</p>
        </div>
      `};
    };
    export default EmailTempForTempPw
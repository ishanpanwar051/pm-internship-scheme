const nodemailer = require('nodemailer');

// Configure SMTP transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.EMAIL_PORT, 10) || 2525,
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || '',
    },
  });
};

// Base HTML template layout (dark premium SaaS theme, prototype branding)
const buildEmailTemplate = (title, recipientName, contentHtml, ctaText = null, ctaUrl = null) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; margin: 0; padding: 24px 12px; color: #f4f4f5; }
    .card { max-width: 600px; margin: 0 auto; background: #111113; border-radius: 12px; overflow: hidden; border: 1px solid #27272a; }
    .header { background: linear-gradient(135deg, #18181b, #111113); color: #ffffff; padding: 26px 24px; text-align: center; border-bottom: 1px solid #27272a; }
    .header h1 { margin: 0; font-size: 18px; font-weight: 800; letter-spacing: 0.3px; }
    .header p { margin: 4px 0 0 0; font-size: 12px; color: #a1a1aa; }
    .banner { height: 3px; background: linear-gradient(90deg, #6366f1, #8b5cf6); }
    .body { padding: 30px 28px; line-height: 1.6; }
    .greeting { font-size: 15px; font-weight: 600; margin-bottom: 16px; }
    .cta-container { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background-color: #6366f1; color: #ffffff !important; padding: 12px 28px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; }
    .note { background: #18181b; border-left: 3px solid #6366f1; padding: 12px 14px; border-radius: 6px; }
    .footer { background: #09090b; padding: 18px; text-align: center; font-size: 11px; color: #71717a; border-top: 1px solid #27272a; }
    .footer p { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="banner"></div>
    <div class="header">
      <h1>✦ Allocation AI</h1>
      <p>Intelligent Internship Matching & Smart Allocation</p>
    </div>
    <div class="body">
      <div class="greeting">Hi ${recipientName || 'there'},</div>
      ${contentHtml}
      ${
        ctaText && ctaUrl
          ? `<div class="cta-container"><a href="${ctaUrl}" class="btn">${ctaText}</a></div>`
          : ''
      }
      <p style="margin-top: 24px; font-size: 13px; color: #a1a1aa;">
        The Allocation AI team
      </p>
    </div>
    <div class="footer">
      <p>This is an automated notification from the Allocation AI platform.</p>
      <p>Educational prototype — all accounts and data are simulated. Not affiliated with any government body.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Safe email sender that catches and logs errors without bubbling exceptions
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Allocation AI" <no-reply@allocation-ai.example>',
      to,
      subject,
      html,
    });
    console.log(`[Email Service] Sent '${subject}' to ${to} | ID: ${info.messageId}`);
    return true;
  } catch (err) {
    console.warn(`[Email Service] Non-critical delivery failure to ${to}: ${err.message}`);
    return false;
  }
};

// 1. Welcome Email on Registration
const sendWelcomeEmail = async (user) => {
  const content = `
    <p>Welcome to <strong>Allocation AI</strong>!</p>
    <p>Your account as <strong>${user.role.toUpperCase()}</strong> has been created successfully.</p>
    <p>To participate in the AI-driven allocation engine, sign in and complete your profile, skills, and preferences so you can be matched.</p>
  `;
  const ctaUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/login`;
  return await sendEmail({
    to: user.email,
    subject: 'Welcome to Allocation AI — Registration Confirmed',
    html: buildEmailTemplate('Registration Confirmed', user.name, content, 'Access Platform', ctaUrl),
  });
};

// 2. Allocation Ready (Sent to Student)
const sendAllocationReadyEmail = async (internUser, allocationDetails) => {
  const scorePercent = Math.round((allocationDetails.matchScore || 0) * 100);
  const content = `
    <p>Great news! The Allocation Engine has processed the pool and matched you with an internship position.</p>
    <div class="note">
      <p style="margin: 0; font-weight: 600; color: #f4f4f5;">Position: ${allocationDetails.slotTitle}</p>
      <p style="margin: 4px 0 0 0; color: #a1a1aa;">Organization: ${allocationDetails.companyName}</p>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #a1a1aa;">AI Match Score: <strong style="color:#818cf8;">${scorePercent}%</strong></p>
    </div>
    <p>Review the details on the platform and formally accept or decline the allocation.</p>
  `;
  const ctaUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/intern/allocation`;
  return await sendEmail({
    to: internUser.email,
    subject: '🎉 Your Allocation is Ready for Review',
    html: buildEmailTemplate('Allocation Ready', internUser.name, content, 'Review Allocation', ctaUrl),
  });
};

// 3. Company Matches Ready
const sendCompanyMatchesReadyEmail = async (companyUser, slotTitle, matchCount) => {
  const content = `
    <p>The AI Allocation Engine has finished its assignment run for your internship:</p>
    <p style="font-size: 16px; font-weight: bold; color: #f4f4f5; margin: 12px 0;">${slotTitle}</p>
    <p><strong>${matchCount} candidate(s)</strong> have been allocated based on skill similarity, preferences, and eligibility.</p>
    <p>Log in to your organization console to inspect matches and confirm acceptances.</p>
  `;
  const ctaUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/company/slots`;
  return await sendEmail({
    to: companyUser.email,
    subject: `Candidate Matches Available — ${slotTitle}`,
    html: buildEmailTemplate('Matches Available', companyUser.name, content, 'Inspect Candidates', ctaUrl),
  });
};

// 4. Acceptance Confirmation (To Student)
const sendAcceptanceConfirmedEmail = async (internUser, companyName, slotTitle, startDate) => {
  const content = `
    <p>Congratulations! <strong>${companyName}</strong> has accepted your placement for:</p>
    <div class="note">
      <p style="margin: 0; font-weight: 600; color: #f4f4f5;">Role: ${slotTitle}</p>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #a1a1aa;">Projected Start: ${new Date(startDate).toLocaleDateString('en-IN')}</p>
    </div>
    <p>Your placement is now confirmed. Details are available on your dashboard.</p>
  `;
  const ctaUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/intern/dashboard`;
  return await sendEmail({
    to: internUser.email,
    subject: '✅ Placement Confirmed',
    html: buildEmailTemplate('Placement Confirmed', internUser.name, content, 'Go to Dashboard', ctaUrl),
  });
};

// 5. Rejection Notification
const sendRejectionEmail = async (internUser, slotTitle, reason) => {
  const content = `
    <p>An update on your allocation for <strong>${slotTitle}</strong>:</p>
    <p>After review, the organization could not confirm this placement${reason ? ` citing: <em>"${reason}"</em>` : ''}.</p>
    <p>Your profile remains active in the candidate pool for subsequent allocation runs.</p>
  `;
  const ctaUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/intern/explore`;
  return await sendEmail({
    to: internUser.email,
    subject: 'Allocation Status Update',
    html: buildEmailTemplate('Allocation Update', internUser.name, content, 'Explore Opportunities', ctaUrl),
  });
};

// 6. Password Reset Token Link
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
  const content = `
    <p>We received a request to reset the password associated with your account.</p>
    <p>Click the button below to set a new password. <strong>This link expires in 15 minutes.</strong></p>
    <p style="color: #f87171; font-size: 12px;">If you did not request this, please ignore this email — your password will remain unchanged.</p>
  `;
  return await sendEmail({
    to: user.email,
    subject: 'Security Alert: Password Reset Request',
    html: buildEmailTemplate('Password Reset', user.name, content, 'Reset Password', resetUrl),
  });
};

module.exports = {
  sendWelcomeEmail,
  sendAllocationReadyEmail,
  sendCompanyMatchesReadyEmail,
  sendAcceptanceConfirmedEmail,
  sendRejectionEmail,
  sendPasswordResetEmail,
};
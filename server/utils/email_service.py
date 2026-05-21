import os
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def generate_6_digit_code():
    """Generates a random 6-digit string."""
    return str(random.randint(100000, 999999))

def send_otp_email(to_email, code):
    """Sends a styled 6-digit HTML code via Google SMTP."""
    sender_email = os.environ.get('MAIL_USERNAME')
    sender_password = os.environ.get('MAIL_PASSWORD')
    
    subject = "Falsicode: Your Verification Code"
    
    # 🌟 NEW: The HTML Email Template with Inline CSS
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 50px 0;">
            <tr>
                <td align="center">
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 450px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        
                        <tr>
                            <td style="background-color: #111827; padding: 30px 20px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; font-weight: 600;">
                                    <span style="color: #10b981;">⎔</span> Falsicode.
                                </h1>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="padding: 40px 30px; text-align: center;">
                                <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 22px; font-weight: 600;">Sign-in Code</h2>
                                <p style="margin: 0 0 35px 0; color: #6b7280; font-size: 15px; line-height: 1.5;">
                                    Here is your Falsicode registration code:
                                </p>

                                <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 25px 15px; margin-bottom: 35px;">
                                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 16px; color: #111827; margin-left: 16px;">
                                        {code}
                                    </span>
                                </div>

                                <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                                    This code will expire in exactly <strong>10 minutes</strong>.
                                </p>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #f3f4f6;">
                                <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                                    If you did not request this verification code, you can safely ignore this email.
                                </p>
                                <p style="margin: 0; color: #d1d5db; font-size: 12px;">
                                    &copy; 2026 Falsicode Plagiarism Detection Engine
                                </p>
                            </td>
                        </tr>
                        
                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
    """

    msg = MIMEMultipart()
    # Format the sender so it says "Falsicode" instead of just the email address
    msg['From'] = f"Falsicode <{sender_email}>"
    msg['To'] = to_email
    msg['Subject'] = subject

    # 🌟 NEW: The No-Reply Redirect Header
    msg.add_header('Reply-To', 'noreply@falsicode.com')
    
    # 🌟 CRITICAL FIX: Attach the body as 'html' so Gmail renders the design
    msg.attach(MIMEText(html_body, 'html'))
    

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        # Ensure Docker prints this immediately
        print(f"Falsicode Auth: HTML OTP successfully sent to {to_email}", flush=True)
        return True
    except Exception as e:
        # Ensure Docker prints the error immediately
        print(f"Falsicode Auth Error: SMTP failed. Details: {e}", flush=True)
        return False
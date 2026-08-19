import os
import random
import smtplib
import json
import urllib.request
import urllib.error
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def generate_6_digit_code():
    """Generates a random 6-digit string."""
    return str(random.randint(100000, 999999))

def send_via_resend(api_key, to_email, subject, html_body):
    """Sends email via Resend REST API over HTTPS Port 443 (Allowed on Render Free Tier)."""
    try:
        url = "https://api.resend.com/emails"
        from_email = os.environ.get('MAIL_FROM', 'Falsicode <onboarding@resend.dev>')
        payload = json.dumps({
            "from": from_email,
            "to": [to_email],
            "subject": subject,
            "html": html_body
        }).encode('utf-8')
        
        req = urllib.request.Request(
            url,
            data=payload,
            headers={
                "Authorization": f"Bearer {api_key.strip()}",
                "Content-Type": "application/json",
                "User-Agent": "Falsicode-App"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=8) as response:
            if response.status in (200, 201):
                print(f"Falsicode Auth: Email sent to {to_email} via Resend HTTPS API", flush=True)
                return True, "Email dispatched via Resend HTTPS API"
            return False, f"Resend API returned status {response.status}"
    except Exception as e:
        print(f"Falsicode Auth: Resend API error: {e}", flush=True)
        return False, str(e)

def send_via_brevo(api_key, sender_email, to_email, subject, html_body):
    """Sends email via Brevo REST API over HTTPS Port 443 (Allowed on Render Free Tier)."""
    try:
        url = "https://api.brevo.com/v3/smtp/email"
        payload = json.dumps({
            "sender": {"name": "Falsicode", "email": sender_email},
            "to": [{"email": to_email}],
            "subject": subject,
            "htmlContent": html_body
        }).encode('utf-8')
        
        req = urllib.request.Request(
            url,
            data=payload,
            headers={
                "api-key": api_key.strip(),
                "Content-Type": "application/json",
                "User-Agent": "Falsicode-App"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=8) as response:
            if response.status in (200, 201):
                print(f"Falsicode Auth: Email sent to {to_email} via Brevo HTTPS API", flush=True)
                return True, "Email dispatched via Brevo HTTPS API"
            return False, f"Brevo API returned status {response.status}"
    except Exception as e:
        print(f"Falsicode Auth: Brevo API error: {e}", flush=True)
        return False, str(e)

def send_otp_email(to_email, code, intent="registration"):
    """Sends a styled 6-digit HTML code via HTTPS API or Google SMTP. Returns (success: bool, detail: str)."""
    resend_key = os.environ.get('RESEND_API_KEY')
    brevo_key = os.environ.get('BREVO_API_KEY')
    sender_email = (os.environ.get('MAIL_USERNAME') or '').strip()
    sender_password = (os.environ.get('MAIL_PASSWORD') or '').strip()
    
    # Dynamic text based on intent
    if intent == "password_update":
        subject = "Falsicode: Security Verification Code"
        header_text = "Security Authorization"
        body_text = "Here is your authorization code to update your security credentials:"
    else:
        subject = "Falsicode: Your Verification Code"
        header_text = "Sign-in Code"
        body_text = "Here is your Falsicode registration code:"
    
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
                                <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 22px; font-weight: 600;">{header_text}</h2>
                                <p style="margin: 0 0 35px 0; color: #6b7280; font-size: 15px; line-height: 1.5;">
                                    {body_text}
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

    # 1. Preferred Cloud Method: Resend HTTPS API (Port 443 - Never blocked on Render)
    if resend_key:
        return send_via_resend(resend_key, to_email, subject, html_body)

    # 2. Alternative Cloud Method: Brevo HTTPS API (Port 443)
    if brevo_key and sender_email:
        return send_via_brevo(brevo_key, sender_email, to_email, subject, html_body)

    # 3. Direct SMTP (Ports 587 / 465 - Works locally or on non-port-blocked hosts)
    if sender_email and sender_password:
        msg = MIMEMultipart()
        msg['From'] = f"Falsicode <{sender_email}>"
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.add_header('Reply-To', 'noreply@falsicode.com')
        msg.attach(MIMEText(html_body, 'html'))

        # Use strict 3-second timeout so it never hangs Gunicorn or causes Render 502
        try:
            server = smtplib.SMTP('smtp.gmail.com', 587, timeout=3)
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
            server.quit()
            print(f"Falsicode Auth: HTML OTP ({intent}) successfully sent to {to_email} via SMTP 587", flush=True)
            return True, "Email dispatched via Gmail SMTP"
        except Exception as e587:
            print(f"Falsicode Auth Notice: Port 587 unavailable ({e587}), trying Port 465 SSL...", flush=True)
            try:
                server_ssl = smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=3)
                server_ssl.login(sender_email, sender_password)
                server_ssl.send_message(msg)
                server_ssl.quit()
                print(f"Falsicode Auth: HTML OTP ({intent}) successfully sent to {to_email} via SMTP 465", flush=True)
                return True, "Email dispatched via Gmail SMTP (SSL)"
            except Exception as e465:
                print(f"Falsicode Auth Notice: Cloud outbound SMTP blocked on Render Free Tier ({e465}). Returning code fallback.", flush=True)
                return False, "Render Free Tier blocks outbound SMTP ports 587/465."

    print("Falsicode Auth Notice: No email API keys configured. Returning code in response.", flush=True)
    return False, "No email credentials configured."
import os
import random
import smtplib
import json
import urllib.request
import urllib.error
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate, make_msgid
from dotenv import load_dotenv

# Ensure environment variables are loaded
_base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
load_dotenv(os.path.join(_base_dir, '.env'))
load_dotenv(os.path.join(os.path.dirname(_base_dir), '.env'))
load_dotenv()

def generate_6_digit_code():
    """Generates a random 6-digit string."""
    return str(random.randint(100000, 999999))

def send_via_resend(api_key, to_email, subject, html_body, text_body=None):
    """Sends email via Resend REST API over HTTPS Port 443 (Allowed on Render Free Tier & Localhost)."""
    try:
        url = "https://api.resend.com/emails"
        from_email = os.environ.get('MAIL_FROM', 'Falsicode <onboarding@resend.dev>')
        payload_dict = {
            "from": from_email,
            "to": [to_email],
            "subject": subject,
            "html": html_body
        }
        if text_body:
            payload_dict["text"] = text_body
        payload = json.dumps(payload_dict).encode('utf-8')
        
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
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status in (200, 201):
                print(f"[Falsicode Auth] Email sent to {to_email} via Resend HTTPS API", flush=True)
                return True, "Email dispatched via Resend HTTPS API"
            return False, f"Resend API returned status {response.status}"
    except urllib.error.HTTPError as he:
        try:
            err_body = he.read().decode('utf-8')
            err_json = json.loads(err_body)
            err_msg = err_json.get('message', str(he))
        except Exception:
            err_msg = str(he)
        print(f"[Falsicode Auth Notice] Resend API HTTP error: {err_msg}", flush=True)
        return False, f"Resend API error: {err_msg}"
    except Exception as e:
        print(f"[Falsicode Auth Notice] Resend API error: {e}", flush=True)
        return False, str(e)

def send_via_brevo(api_key, sender_email, to_email, subject, html_body, text_body=None):
    """Sends email via Brevo REST API over HTTPS Port 443 (Allowed on Render Free Tier & Localhost)."""
    try:
        url = "https://api.brevo.com/v3/smtp/email"
        payload_dict = {
            "sender": {"name": "Falsicode", "email": sender_email},
            "to": [{"email": to_email}],
            "subject": subject,
            "htmlContent": html_body
        }
        if text_body:
            payload_dict["textContent"] = text_body
        payload = json.dumps(payload_dict).encode('utf-8')
        
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
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status in (200, 201):
                print(f"[Falsicode Auth] Email sent to {to_email} via Brevo HTTPS API", flush=True)
                return True, "Email dispatched via Brevo HTTPS API"
            return False, f"Brevo API returned status {response.status}"
    except urllib.error.HTTPError as he:
        try:
            err_body = he.read().decode('utf-8')
            err_json = json.loads(err_body)
            err_msg = err_json.get('message', str(he))
        except Exception:
            err_msg = str(he)
        print(f"[Falsicode Auth Notice] Brevo API HTTP error: {err_msg}", flush=True)
        return False, f"Brevo API error: {err_msg}"
    except Exception as e:
        print(f"[Falsicode Auth Notice] Brevo API error: {e}", flush=True)
        return False, str(e)

def send_otp_email(to_email, code, intent="registration"):
    """Sends a styled 6-digit HTML code via HTTPS API or direct SMTP. Works in both localhost & production."""
    to_email = (to_email or '').strip()
    # Fast sanity check to avoid slow DNS/SMTP timeouts on invalid emails
    if not to_email or '@' not in to_email or '.' not in to_email.split('@')[-1] or len(to_email.split('@')[-1].split('.')[-1]) < 2:
        return False, "Invalid recipient email address format."

    resend_key = (os.environ.get('RESEND_API_KEY') or '').strip()
    brevo_key = (os.environ.get('BREVO_API_KEY') or '').strip()
    
    # SMTP Configuration (Supports standard and custom env variables)
    smtp_host = (os.environ.get('SMTP_HOST') or os.environ.get('SMTP_SERVER') or 'smtp.gmail.com').strip()
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    sender_email = (os.environ.get('MAIL_USERNAME') or os.environ.get('SMTP_USER') or '').strip()
    sender_password = (os.environ.get('MAIL_PASSWORD') or os.environ.get('SMTP_PASS') or '').strip().replace(' ', '').replace('"', '').replace("'", "")
    
    # Dynamic text based on intent
    if intent == "password_update":
        subject = "Falsicode: Security Verification Code"
        header_text = "Security Authorization"
        body_text = "Here is your authorization code to update your security credentials:"
    elif intent == "email_update":
        subject = "Falsicode: Verify Your New Email Address"
        header_text = "Email Update Verification"
        body_text = "Here is your verification code to confirm and link this new email address:"
    else:
        subject = "Falsicode: Your Verification Code"
        header_text = "Sign-in Code"
        body_text = "Here is your Falsicode registration code:"
    
    # Plain text version for spam filters & clients that don't support HTML
    plain_text_body = f"""Falsicode - Code Plagiarism Detection System
==================================================

{header_text}
{body_text}

VERIFICATION CODE: {code}

This code will expire in exactly 10 minutes.
If you did not request this verification code, you can safely ignore this email.

(c) 2026 Falsicode Plagiarism Detection Engine
"""

    html_body = f"""<!DOCTYPE html>
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
</html>"""

    # 1. Cloud Method: Resend HTTPS API (Port 443) - if configured
    if resend_key:
        success, msg = send_via_resend(resend_key, to_email, subject, html_body, plain_text_body)
        if success:
            return True, msg
        print(f"[Falsicode Auth Notice] Resend failed ({msg}), falling back to SMTP...", flush=True)

    # 2. Cloud Method: Brevo HTTPS API (Port 443) - if configured
    if brevo_key and sender_email:
        success, msg = send_via_brevo(brevo_key, sender_email, to_email, subject, html_body, plain_text_body)
        if success:
            return True, msg
        print(f"[Falsicode Auth Notice] Brevo failed ({msg}), falling back to SMTP...", flush=True)

    # 3. Direct SMTP (Ports 587 / 465) - Works with Gmail SMTP & custom mail servers
    if sender_email and sender_password:
        msg = MIMEMultipart('alternative')
        msg['From'] = f"Falsicode <{sender_email}>"
        msg['To'] = to_email
        msg['Subject'] = subject
        msg['Date'] = formatdate(localtime=True)
        msg['Message-ID'] = make_msgid(domain='falsicode.com')
        msg.add_header('Reply-To', sender_email)
        msg.add_header('X-Mailer', 'Falsicode Mailer v2.0')

        # Attach text part first, then HTML part for standard MIME multipart/alternative
        part_text = MIMEText(plain_text_body, 'plain', 'utf-8')
        part_html = MIMEText(html_body, 'html', 'utf-8')
        msg.attach(part_text)
        msg.attach(part_html)

        last_smtp_err = ""
        # Try Port 587 with STARTTLS (fast 5s timeout)
        try:
            server = smtplib.SMTP(smtp_host, smtp_port, timeout=5)
            server.ehlo()
            if smtp_port == 587:
                server.starttls()
                server.ehlo()
            server.login(sender_email, sender_password)
            server.send_message(msg)
            server.quit()
            print(f"[Falsicode Auth] HTML OTP ({intent}) successfully sent to {to_email} via SMTP {smtp_port}", flush=True)
            return True, f"Email dispatched via SMTP ({smtp_host}:{smtp_port})"
        except Exception as e_smtp:
            last_smtp_err = str(e_smtp)
            print(f"[Falsicode Auth Notice] SMTP {smtp_port} failed ({e_smtp}), trying SSL Port 465 fallback...", flush=True)
            try:
                server_ssl = smtplib.SMTP_SSL(smtp_host, 465, timeout=5)
                server_ssl.ehlo()
                server_ssl.login(sender_email, sender_password)
                server_ssl.send_message(msg)
                server_ssl.quit()
                print(f"[Falsicode Auth] HTML OTP ({intent}) successfully sent to {to_email} via SMTP 465 SSL", flush=True)
                return True, f"Email dispatched via SMTP SSL ({smtp_host}:465)"
            except Exception as e_ssl:
                last_smtp_err = str(e_ssl)
                print(f"[Falsicode Auth Notice] SMTP SSL failed ({e_ssl}).", flush=True)

        return False, f"SMTP authentication/connection failed: {last_smtp_err}."

    return False, "No email credentials configured. Please configure MAIL_USERNAME & MAIL_PASSWORD or RESEND_API_KEY in your server/.env file."
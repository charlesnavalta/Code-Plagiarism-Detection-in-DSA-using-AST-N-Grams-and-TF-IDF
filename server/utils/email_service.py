import os
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def generate_6_digit_code():
    """Generates a random 6-digit string."""
    return str(random.randint(100000, 999999))

def send_otp_email(to_email, code):
    """Sends the 6-digit code via Google SMTP."""
    sender_email = os.environ.get('MAIL_USERNAME')
    sender_password = os.environ.get('MAIL_PASSWORD')
    
    subject = "Falsicode: Your Verification Code"
    body = f"""
    Hello,
    
    Welcome to Falsicode! Your 6-digit verification code is:
    
    {code}
    
    This code will expire in 10 minutes. Do not share this code with anyone.
    
    - The Falsicode System
    """

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        # 🌟 FIX: Added flush=True
        print(f"Falsicode Auth: OTP successfully sent to {to_email}", flush=True)
        return True
    except Exception as e:
        # 🌟 FIX: Added flush=True
        print(f"Falsicode Auth Error: SMTP failed. Details: {e}", flush=True)
        return False
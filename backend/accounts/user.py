from fastapi import APIRouter, BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from utils.crypto import CryptoManager
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel
import base64
import os

load_dotenv('.env')

class Data(BaseModel):
    email: str
    password: str

class Envs:
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_FROM = os.getenv('MAIL_FROM')
    MAIL_PORT = int(os.getenv('MAIL_PORT'))
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_FROM_NAME = os.getenv('MAIL_FROM_NAME')
    SB_url: str = os.getenv("SUPABASE_URL")
    SB_key: str = os.getenv("SUPABASE_KEY")
    debug = os.getenv("DEBUG")
    website_url = os.getenv("VITE_WEBSITE_URL")

conf = ConnectionConfig(
    MAIL_USERNAME=Envs.MAIL_USERNAME,
    MAIL_PASSWORD=Envs.MAIL_PASSWORD,
    MAIL_FROM=Envs.MAIL_FROM,
    MAIL_PORT=Envs.MAIL_PORT,
    MAIL_SERVER=Envs.MAIL_SERVER,
    MAIL_FROM_NAME=Envs.MAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

router = APIRouter(prefix="/user", tags=["user"])

@router.post("/create_account")
async def create_account(data: Data, background_tasks: BackgroundTasks):
    crypto_manager = CryptoManager()
    password = crypto_manager.hash_data(data.password.encode())
    email = data.email
    if not Envs.debug and (email.endswith("@osu.edu") or email.endswith("@buckeyemail.osu.edu")):
        return {"message": "Invalid email domain. Please use an osu.edu email."}
    
    # Save user information to the database
    supabase: Client = create_client(Envs.SB_url, Envs.SB_key)
    uid = crypto_manager.hash_data(email.encode())
    encrypted_email = crypto_manager.encrypt_data(email, base64.urlsafe_b64decode(os.getenv('ENCRYPTION_KEY'))).hex()
    supabase.table("accounts").insert({"id" : uid, "email": encrypted_email, "password": password}).execute()

    token = crypto_manager.generate_key(length=64)
    token_str = base64.urlsafe_b64encode(token).decode('utf-8')
    token_str = crypto_manager.encrypt_data(token_str, base64.urlsafe_b64decode(os.getenv('ENCRYPTION_KEY'))).hex()
    supabase.table("account_tokens").insert({"id" : uid, "token": token_str}).execute()
    verify_link = f"{Envs.website_url}/account/verify_token?token={token_str}&user_email={encrypted_email}"

    html_body = f"""
    <p>Hello USER_FNAME USER_LNAME,</p>
    <p>Thank you for creating an account with COMPANY NAME. Please click the button below to verify your account:</p>
    <div style="margin: 20px 0;">
        <a href="{verify_link}" 
        style="background-color: #4CAF50; 
                color: white; 
                padding: 14px 25px; 
                text-align: center; 
                text-decoration: none; 
                display: inline-block; 
                border-radius: 5px; 
                font-weight: bold;">
            Verify Account
        </a>
    </div>
    """

    message = MessageSchema(
        subject="Verify Your Email Address",
        recipients=[email],
        body=html_body,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message, message)
    return {"message": "Account created. Please check your email to verify your account."}

@router.get("/verify_token")
async def verify_token(token: str, user_email: str):
    supabase: Client = create_client(Envs.SB_url, Envs.SB_key)
    crypto_manager = CryptoManager()
    token = crypto_manager.decrypt_data(bytes.fromhex(token), base64.urlsafe_b64decode(os.getenv('ENCRYPTION_KEY'))).decode()
    user_email = crypto_manager.decrypt_data(bytes.fromhex(user_email), base64.urlsafe_b64decode(os.getenv('ENCRYPTION_KEY'))).decode()
    uid = crypto_manager.hash_data(user_email.encode())
    valid_token = supabase.table("account_tokens").select("token").eq("id", uid).execute().data[0]['token']
    valid_token = crypto_manager.decrypt_data(bytes.fromhex(valid_token), base64.urlsafe_b64decode(os.getenv('ENCRYPTION_KEY'))).decode()

    if token == valid_token:
        supabase.table("accounts").update({"verified" : True}).eq("id", uid).execute()
        return {"message": "Account verified successfully!"}
    else:
         return {"message": "Invalid or expired token."}
    

@router.post("/resend_verification_email")
async def send_verification_email(data: Data, background_tasks: BackgroundTasks):
    crypto_manager = CryptoManager()
    email = data.email
    if not (email.endswith("@osu.edu") or email.endswith("@buckeyemail.osu.edu")):
        return {"message": "Invalid email domain. Please use an osu.edu email."}

    token = crypto_manager.generate_key(length=64)
    verify_link = f"{Envs.website_url}/account/verify_token?token={token}&user_email={email}"

    message = MessageSchema(
        subject="Verify Your Account",
        recipients=[email],
        body=f"Please click the following link to verify your account: {verify_link}",
        subtype=MessageType.plain
    )

    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message, message)
    return {"message": "Account created. Please check your email to verify your account."}

@router.post("/login")
async def login(data: Data):
    crypto_manager = CryptoManager()
    email = data.email
    password = crypto_manager.hash_data(data.password.encode())
    supabase: Client = create_client(Envs.SB_url, Envs.SB_key)
    user = supabase.table("accounts").select("*").eq("email", email).execute().data
    if not user:
        return {"message": "Invalid email or password."}
    user = user[0]
    if user['password'] != password:
        return {"message": "Invalid email or password."}
    if not user['verified']:
        return {"message": "Account not verified. Please check your email."}
    
    return {"message": "Login successful!"}

@router.post("/debug")
async def debug(data: Data):
    supabase: Client = create_client(Envs.SB_url, Envs.SB_key)
    crypto_manager = CryptoManager()
    uid = crypto_manager.hash_data(data.email.encode())
    supabase.table("account_tokens").delete().eq("id", uid).execute()
    supabase.table("accounts").delete().eq("id", uid).execute()
    return {"message": "Debug complete. User data deleted."}
    

@router.delete("/delete_account")
async def deleteAccount(data: Data, background_tasks: BackgroundTasks):
    pass


@router.post("/create_event")
async def createEvent(eventID: str, eventName: str):
    pass

@router.delete("/delete_event")
async def deleteEvent(eventID: str, userID: str):
    pass

@router.post("modify_account")
async def modifyAccount(columnID: str, value: str):
    pass
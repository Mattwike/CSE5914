from fastapi import APIRouter, BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from crypto import CryptoManager
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
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

router = APIRouter(prefix="/account", tags=["account"])

@router.post("/create_account")
async def create_account(data: Data, background_tasks: BackgroundTasks):
    crypto_manager = CryptoManager()
    password = crypto_manager.hash_data(data.password.encode())
    email = data.email
    # if not (email.endswith("@osu.edu") or email.endswith("@buckeyemail.osu.edu")):
    #     return {"message": "Invalid email domain. Please use an osu.edu email."}
    
    # Save user information to the database
    print(f"Supabase URL: {Envs.SB_url}")
    print(f"Supabase Key: {Envs.SB_key}")
    supabase: Client = create_client(Envs.SB_url, Envs.SB_key)
    supabase.table("accounts").insert({"email": email, "password": password}).execute()

    token = crypto_manager.generate_key(length=64)
    token_str = base64.urlsafe_b64encode(token).decode('utf-8')
    uid = supabase.table("accounts").select("id").eq("email", email).execute().data[0]['id']
    supabase.table("account_tokens").insert({"id" : uid, "token": token_str}).execute()
    verify_link = f"http://localhost:8000/account/verify_token?token={token}&user_email={email}"

    message = MessageSchema(
        subject="Verify Your Account",
        recipients=[email],
        body=f"Please click the following link to verify your account: {verify_link}",
        subtype=MessageType.plain
    )

    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message, message)
    return {"message": "Account created. Please check your email to verify your account."}


@router.post("/resend_verification_email")
async def send_verification_email(data: Data, background_tasks: BackgroundTasks):
    crypto_manager = CryptoManager()
    email = data.email
    if not (email.endswith("@osu.edu") or email.endswith("@buckeyemail.osu.edu")):
        return {"message": "Invalid email domain. Please use an osu.edu email."}

    token = crypto_manager.generate_key(length=64)
    verify_link = f"http://localhost:8000/account/verify_token?token={token}&user_email={email}"

    message = MessageSchema(
        subject="Verify Your Account",
        recipients=[email],
        body=f"Please click the following link to verify your account: {verify_link}",
        subtype=MessageType.plain
    )

    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message, message)
    return {"message": "Account created. Please check your email to verify your account."}

@router.get("/verify_token")
async def verify_token(token: str, user_email: str):
    supabase: Client = create_client(Envs.SB_url, Envs.SB_key)
    valid_token = supabase.table("accounts").select("id, email, account_tokens(account_token)").eq("email", user_email).execute()
    print(f"Token from database: {token}")
    if token == valid_token:
        supabase.table("accounts").update({"verified": "True"}).eq("email", user_email).execute()
        return {"message": "Account verified successfully!"}
    else:
         return {"message": "Invalid or expired token."}
import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def save_user_information(email: str, password: str):
    response = supabase.table("logindata").insert({"email": email, "password": password}).execute()


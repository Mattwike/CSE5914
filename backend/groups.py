from fastapi import APIRouter, BackgroundTasks, Depends
from utils.auth_dependency import get_current_user

router = APIRouter(prefix="/groups", tags=["groups"])


@router.post("/{user_id}/create")
async def create_group(group_name: str, user_id: str, current_user: dict = Depends(get_current_user)):
    pass


@router.delete("/{group_id}/delete")
async def delete_group(group_name: str, user_id: str, current_user: dict = Depends(get_current_user)):
    pass


@router.post("/{group_id}/add")
async def add_member(group_name: str, username: str, creater_id: str, current_user: dict = Depends(get_current_user)):
    pass


@router.delete("/{group_id}/delete/user/{username}")
async def remove_member(group_name: str, username: str, creater_id: str, current_user: dict = Depends(get_current_user)):
    pass


@router.post("/group/{group_id}/join-request/{user_id}")
async def join_request(user_id: str, group_name: str, current_user: dict = Depends(get_current_user)):
    pass

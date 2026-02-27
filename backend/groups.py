from fastapi import APIRouter, BackgroundTasks

router = APIRouter(prefix="/groups", tags=["groups"])


@router.post("/create_group")
async def createGroup(group_name: str, user_id: str):
    pass


@router.delete("/delete_group")
async def deleteGroup(group_name: str, user_id: str):
    pass


@router.post("/add_member")
async def addMember(group_name: str, username: str, creater_id: str):
    pass


@router.delete("/remove_member")
async def removeMember(group_name: str, username: str, creater_id: str):
    pass


@router.put("/join_request")
async def joinRequest(user_id: str, group_name: str):
    pass

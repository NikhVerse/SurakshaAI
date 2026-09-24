from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from apps.api.models.database import get_db
from apps.api.models.entities import User, AuditLog
from apps.api.schemas.schemas import UserResponse, UserUpdate
from apps.api.auth.dependencies import get_current_user, require_roles

router = APIRouter(prefix="/users", tags=["Users & Profiles"])


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Retrieve authenticated user's real database profile."""
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_current_user_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update authenticated user's own profile information."""
    if payload.first_name is not None and payload.first_name.strip():
        current_user.first_name = payload.first_name.strip()
    if payload.middle_name is not None:
        current_user.middle_name = payload.middle_name.strip() if payload.middle_name else None
    if payload.last_name is not None and payload.last_name.strip():
        current_user.last_name = payload.last_name.strip()
    if payload.age is not None:
        current_user.age = payload.age
    if payload.dob is not None and payload.dob.strip():
        current_user.dob = payload.dob.strip()
    if payload.gender is not None and payload.gender.strip():
        current_user.gender = payload.gender.strip()
    if payload.role is not None and payload.role.strip():
        current_user.role = payload.role.strip()
    if payload.region is not None and payload.region.strip():
        current_user.region = payload.region.strip()

    if payload.full_name is not None and payload.full_name.strip():
        current_user.full_name = payload.full_name.strip()
    elif current_user.first_name and current_user.last_name:
        parts = [current_user.first_name]
        if current_user.middle_name:
            parts.append(current_user.middle_name)
        parts.append(current_user.last_name)
        current_user.full_name = " ".join(parts)

    if payload.phone is not None:
        current_user.phone = payload.phone.strip() if payload.phone else None
    if payload.profile_image is not None:
        current_user.profile_image = payload.profile_image.strip() if payload.profile_image else None

    db.commit()
    db.refresh(current_user)

    audit = AuditLog(
        user_id=current_user.id,
        action="PROFILE_UPDATED",
        entity_type="USER",
        entity_id=current_user.id,
        details={
            "full_name": current_user.full_name,
            "region": current_user.region,
            "role": current_user.role,
            "phone": current_user.phone,
        },
    )
    db.add(audit)
    db.commit()

    return current_user


@router.get("", response_model=List[UserResponse])
def list_users(
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List real registered database users (accessible by authenticated operators)."""
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    if status:
        query = query.filter(User.account_status == status)

    users = query.order_by(User.created_at.desc()).offset(offset).limit(limit).all()
    return users


@router.patch("/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: str,
    role: Optional[str] = Query(None),
    account_status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles(["ADMINISTRATOR", "SUPER_ADMIN"])),
):
    """Admin-only: update user role or account status."""
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    if role:
        target_user.role = role
    if account_status:
        target_user.account_status = account_status
        if account_status == "INACTIVE":
            target_user.is_active = False
        elif account_status == "ACTIVE":
            target_user.is_active = True

    db.commit()
    db.refresh(target_user)

    audit = AuditLog(
        user_id=admin_user.id,
        action="USER_ROLE_UPDATED",
        entity_type="USER",
        entity_id=target_user.id,
        details={"updated_role": target_user.role, "account_status": target_user.account_status},
    )
    db.add(audit)
    db.commit()

    return target_user

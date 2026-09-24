from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from apps.api.models.database import get_db
from apps.api.models.entities import User, AuditLog
from apps.api.schemas.schemas import UserLogin, UserRegister, UserResponse, TokenResponse
from apps.api.auth.security import verify_password, get_password_hash, create_access_token
from apps.api.auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse)
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    clean_email = payload.email.lower().strip()
    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Compute name and personal details with robust fallbacks
    f_name = payload.first_name.strip() if payload.first_name else (payload.full_name.split(" ")[0] if payload.full_name else "Operator")
    l_name = payload.last_name.strip() if payload.last_name else (payload.full_name.split(" ")[-1] if payload.full_name and len(payload.full_name.split(" ")) > 1 else "User")
    m_name = payload.middle_name.strip() if payload.middle_name else None

    computed_name = payload.full_name
    if not computed_name:
        parts = [f_name]
        if m_name:
            parts.append(m_name)
        parts.append(l_name)
        computed_name = " ".join(parts)

    new_user = User(
        email=clean_email,
        full_name=computed_name,
        first_name=f_name,
        middle_name=m_name,
        last_name=l_name,
        age=payload.age or 28,
        dob=payload.dob.strip() if payload.dob else "01-Jan-1998",
        gender=payload.gender.strip() if payload.gender else "Other",
        region=payload.region.strip() if payload.region else "India - Western Offshore (Mumbai High)",
        phone=payload.phone.strip() if payload.phone else None,
        hashed_password=get_password_hash(payload.password),
        role=payload.role or "HSE_ANALYST",
        account_status=payload.account_status or "ACTIVE",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    audit = AuditLog(
        user_id=new_user.id,
        action="USER_REGISTERED",
        entity_type="USER",
        entity_id=new_user.id,
        details={
            "email": new_user.email,
            "role": new_user.role,
            "region": new_user.region,
            "age": new_user.age,
            "gender": new_user.gender,
        }
    )
    db.add(audit)
    db.commit()

    token = create_access_token({"sub": new_user.id, "email": new_user.email, "role": new_user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }


@router.post("/login", response_model=TokenResponse)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    clean_email = payload.email.lower().strip()
    user = db.query(User).filter(User.email == clean_email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        audit = AuditLog(
            action="LOGIN_FAILED",
            entity_type="AUTH",
            details={"email": clean_email}
        )
        db.add(audit)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.is_active or user.account_status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive or suspended. Please contact administrator."
        )

    from datetime import datetime, timezone
    user.last_login_at = datetime.now(timezone.utc)
    if payload.region:
        user.region = payload.region.strip()
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})

    audit = AuditLog(
        user_id=user.id,
        action="LOGIN_SUCCESS",
        entity_type="AUTH",
        entity_id=user.id,
        details={"role": user.role, "region": user.region}
    )
    db.add(audit)
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }



@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    audit = AuditLog(
        user_id=current_user.id,
        action="LOGOUT",
        entity_type="AUTH",
        entity_id=current_user.id
    )
    db.add(audit)
    db.commit()
    return {"message": "Logged out successfully"}

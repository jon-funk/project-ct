from pydantic import BaseModel, EmailStr, validator


def validate_password(password: str) -> str:
    """
    Verify that a password is between 7 and 80 characters in length, and contains
    at least one non-alphanumeric character.
    """
    password_len = len(password)
    if password_len < 7:
        raise ValueError("Password must be at least 7 characters in length.")
    elif 79 < password_len:
        raise ValueError("Password must be shorter than 80 characters.")

    found_upper, found_digit, found_non_alpha_num = False, False, False
    for character in password:
        if character.isupper():
            found_upper = True
        elif character.isdigit():
            found_digit = True
        elif not character.isalnum():
            found_non_alpha_num = True


        if found_upper and found_digit:
            break

    if not found_digit:
        raise ValueError("Password must contain at least one number.")

    if not found_upper:
        raise ValueError("Password must contain at least one upper case letter.")
    
    if not found_non_alpha_num:
        raise ValueError("Password must contain at least one non-alphanumeric character.")

    return password


class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @validator("password", allow_reuse=True)
    def _validate_password(cls, password: str) -> str:
        return validate_password(password)
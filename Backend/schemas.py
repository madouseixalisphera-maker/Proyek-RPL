from pydantic import BaseModel
from typing import Optional

# Config: orm_mode = True wajib biar bisa baca data dari SQL
class Service(BaseModel):
    title: str
    description: str
    class Config:
        orm_mode = True

class Testimonial(BaseModel):
    name: str
    role: str
    quote: str
    class Config:
        orm_mode = True

class Message(BaseModel):
    name: str
    email: str
    text: str
    is_read: Optional[bool] = False 
    timestamp: Optional[str] = None
    class Config:
        orm_mode = True

class Article(BaseModel):
    title: str
    category: str
    content: str
    date: Optional[str] = None
    class Config:
        orm_mode = True

class LoginItem(BaseModel): 
    username: str
    password: str
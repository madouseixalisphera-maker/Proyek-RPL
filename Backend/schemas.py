from pydantic import BaseModel
from typing import Optional

# 1. SERVICE SCHEMA
class Service(BaseModel):
    title: str
    description: str
    icon: str  # Wajib ada Icon
    class Config:
        from_attributes = True

# 2. TESTIMONIAL SCHEMA
class Testimonial(BaseModel):
    name: str
    role: str
    quote: str
    image_url: Optional[str] = None # Optional Gambar
    class Config:
        from_attributes = True

# 3. MESSAGE SCHEMA
class Message(BaseModel):
    name: str
    email: str
    text: str
    is_read: Optional[bool] = False 
    timestamp: Optional[str] = None
    class Config:
        from_attributes = True

# 4. ARTICLE SCHEMA
class Article(BaseModel):
    title: str
    category: str
    content: str
    date: Optional[str] = None
    image_url: Optional[str] = None # Optional Gambar
    class Config:
        from_attributes = True

# 5. LOGIN SCHEMA
class LoginItem(BaseModel): 
    username: str
    password: str
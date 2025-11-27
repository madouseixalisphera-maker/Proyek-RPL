from sqlalchemy import Column, Integer, String, Boolean, Text
from database import Base 

class DBService(Base):
    __tablename__ = "services"
    __table_args__ = {'extend_existing': True} # <--- TAMBAHAN SAKTI
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    description = Column(Text)
    icon = Column(String)

class DBTestimonial(Base):
    __tablename__ = "testimonials"
    __table_args__ = {'extend_existing': True} # <--- TAMBAHAN SAKTI
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    role = Column(String)
    quote = Column(Text)

class DBMessage(Base):
    __tablename__ = "messages"
    __table_args__ = {'extend_existing': True} # <--- TAMBAHAN SAKTI
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    text = Column(Text)
    is_read = Column(Boolean, default=False)
    timestamp = Column(String)

class DBArticle(Base):
    __tablename__ = "articles"
    __table_args__ = {'extend_existing': True} # <--- TAMBAHAN SAKTI
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    category = Column(String)
    content = Column(Text)
    date = Column(String)
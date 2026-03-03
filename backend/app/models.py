from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
Base = declarative_base()
class Resource(Base):
  __tablename__ = "Recursos"
  id = Column(Integer, primary_key=True)
  title = Column(Text)
  description = Column(Text)
  resource_type = Column(String(50))
  tags = Column(Text)
  url = Column(Text, unique=True)
engine = create_engine(os.getenv('DATABASE_URL'), connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
def init_db():
  Base.metadata.create_all(bind=engine)
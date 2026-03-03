from pydantic import BaseModel
from typing import List

class SmartAssistRequest(BaseModel):
  title: str
  resource_type: str
class SmartAssistResponse(BaseModel):
  description: str
  tags: List[str]
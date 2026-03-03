import time
import logging
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.models import Resource, SessionLocal, init_db
from app.schemas import SmartAssistRequest, SmartAssistResponse
from app.services.ai_service import generate_educational_metadata

init_db()
app = FastAPI(title="Hub de Recursos Educacionais")
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()

@app.post("/smart-assist", response_model=SmartAssistResponse)
async def smart_assist(data: SmartAssistRequest):
  start_time = time.time()
  try:
    result, tokens = generate_educational_metadata(data.title, data.resource_type)
    latency = time.time() - start_time
    logger.info(f'[INFO] Request da IA: Title="{data.title}", TokenUsage={tokens}, Latency={latency:.2f}s')
    return result
  except Exception as e:
    logger.error(f"[ERROR] Falha na IA: {str(e)}")
    raise HTTPException(status_code=500, detail="Erro ao processar sugestão da IA.")

@app.post("/resources")
def create_resource(data: dict, db: Session = Depends(get_db)):
  existing = db.query(Resource).filter(Resource.url == data.get('url')).first()
  if existing:
    raise HTTPException(
      status_code=400, 
      detail="Esta URL já está cadastrada no sistema."
    )
  new_resource = Resource(
    title=data['title'],
    description=data['description'],
    resource_type=data['resource_type'],
    tags=data['tags'],
    url=data.get('url')
  )
  db.add(new_resource)
  db.commit()
  db.refresh(new_resource)
  return new_resource

@app.get("/resources")
def list_resources(db: Session = Depends(get_db)):
  return db.query(Resource).all()

@app.delete("/resources/all")
def delete_all_resources(db: Session = Depends(get_db)):
  try:
    num_deleted = db.query(Resource).delete()
    db.commit()
    logger.info(f"[INFO] Exclusão em massa: {num_deleted} recursos removidos.")
    return {"message": f"{num_deleted} recursos removidos com sucesso"}
  except Exception as e:
    db.rollback()
    logger.error(f"[ERROR] Falha ao excluir todos: {str(e)}")
    raise HTTPException(status_code=500, detail="Erro ao limpar o banco de dados")

@app.delete("/resources/{resource_id}")
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
  resource = db.query(Resource).filter(Resource.id == resource_id).first()
  if not resource:
    raise HTTPException(status_code=404, detail="Recurso não encontrado")
  db.delete(resource)
  db.commit()
  return {"message": "Recurso removido com sucesso"}

@app.put("/resources/{resource_id}")
def update_resource(resource_id: int, data: dict, db: Session = Depends(get_db)):
  resource = db.query(Resource).filter(Resource.id == resource_id).first()
  if not resource:
    raise HTTPException(status_code=404, detail="Recurso não encontrado")
  new_url = data.get('url')
  if new_url and new_url != resource.url:
    duplicate = db.query(Resource).filter(Resource.url == new_url).first()
    if duplicate:
      raise HTTPException(status_code=400, detail="Esta URL já pertence a outro recurso.")
  for key, value in data.items():
    setattr(resource, key, value)
  db.commit()
  db.refresh(resource)
  return resource

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": time.time()}
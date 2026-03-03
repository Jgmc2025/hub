import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("API_KEY"))
def generate_educational_metadata(title: str, resource_type: str):
  prompt = f"""
  Você é um Assistente Pedagógico.
  Com base no título "{title}" e no tipo de recurso "{resource_type}",
  gere uma descrição educativa e 3 tags relevantes.

  1. DESCRIPTION: Uma descrição pedagógica clara. 
    - LIMITE MÍNIMO: 80 caracteres (contando espaços).
    - LIMITE MÁXIMO: 800 caracteres (contando espaços).
  
  2. TAGS: Uma lista de palavras-chave.
    - REGRA DE OURO: Cada tag deve ser uma ÚNICA PALAVRA (sem espaços).
    - LIMITE MÁXIMO: Cada tag deve ter no máximo 25 caracteres.
  
  Responda estritamente em formato JSON:
  {{
    "description": "Uma descrição de 5 a 7 frases.",
    "tags": ["tag1", "tag2", "tag3"]
  }}
  """
  try:
    completion = client.chat.completions.create(
      model=os.getenv("AI_MODEL"), 
      messages=[
        {"role": "system", "content": "Você é um assistente que responde apenas em JSON."},
        {"role": "user", "content": prompt}
      ],
      response_format={"type": "json_object"}
    )
    content = json.loads(completion.choices[0].message.content)
    usage = completion.usage.total_tokens 
    return content, usage
  except Exception as e:
    print(f"Erro no preenchimento pela IA: {e}")
    fallback_content = {
      "description": f"Recurso educativo sobre {title}. Conteúdo selecionado para apoio pedagógico e estudo.",
      "tags": ["Educação", resource_type, "Geral"]
    }
    return fallback_content, 0
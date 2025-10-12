from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from ai_engine import AIEngine

load_dotenv()

app = FastAPI(title="Inventory AI Assistant")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Engine
BACKEND_URL = os.getenv("NODE_BACKEND_URL", "http://localhost:5000/api")
ai_engine = AIEngine(BACKEND_URL)

class ChatRequest(BaseModel):
    message: str
    token: str

class ChatResponse(BaseModel):
    answer: str
    data: dict = {}

@app.get("/")
def root():
    return {
        "message": "Inventory AI Assistant API",
        "status": "active",
        "version": "1.0.0"
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    AI Chat endpoint
    """
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        if not request.token:
            raise HTTPException(status_code=401, detail="Authentication token required")
        
        # Process query with AI engine
        result = ai_engine.analyze_query(request.message, request.token)
        
        return ChatResponse(
            answer=result['answer'],
            data=result.get('data', {})
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI processing error: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)

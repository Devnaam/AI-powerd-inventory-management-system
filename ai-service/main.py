from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from gemini_engine import GeminiAIEngine
from typing import List, Optional

load_dotenv()

app = FastAPI(title="Inventory AI Assistant - Gemini Powered")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini AI Engine
BACKEND_URL = os.getenv("NODE_BACKEND_URL", "http://localhost:5000/api")
ai_engine = GeminiAIEngine(BACKEND_URL)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    token: str
    conversation_history: Optional[List[Message]] = []

class ChatResponse(BaseModel):
    answer: str
    model: str
    timestamp: str

@app.get("/")
def root():
    return {
        "message": "Inventory AI Assistant API - Powered by Gemini 2.0 Flash",
        "status": "active",
        "version": "2.0.0",
        "model": "gemini-2.0-flash-exp"
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    AI Chat endpoint with Gemini 2.0 Flash
    """
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        if not request.token:
            raise HTTPException(status_code=401, detail="Authentication token required")
        
        # Process with Gemini AI
        result = await ai_engine.chat(
            request.message, 
            request.token,
            conversation_history=[msg.dict() for msg in request.conversation_history]
        )
        
        from datetime import datetime
        return ChatResponse(
            answer=result['answer'],
            model=result.get('model', 'gemini-2.0-flash'),
            timestamp=datetime.now().isoformat()
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI processing error: {str(e)}")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model": "gemini-2.0-flash-exp",
        "backend_url": BACKEND_URL
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)

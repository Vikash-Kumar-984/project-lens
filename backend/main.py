from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from gemini_agent import analyze_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AI LifeLens backend running"}


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    question: str = Form(...)
):

    try:

        image_bytes = await file.read()

        answer = analyze_image(image_bytes, question)

        return {"answer": answer}

    except Exception as e:

        return {"answer": f"AI processing error: {str(e)}"}
import google.generativeai as genai
from PIL import Image
import io

API_KEY = "AIzaSyAu2P7SVmVNJndJ5JJSoXRUPi6cuTXTDL8"

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

def analyze_image(image_bytes, question):

    image = Image.open(io.BytesIO(image_bytes))

    prompt = f"""
Analyze the image carefully.

Return output in STRUCTURED markdown format.

## Overview
Explain the image.

## Key Objects
• object 1
• object 2

## Important Details
• detail 1
• detail 2

## Context
Explain the environment.

User question:
{question}
"""

    response = model.generate_content([prompt, image])

    return response.text
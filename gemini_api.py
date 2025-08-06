import google.generativeai as genai
# backend/gemini_api.py
GENAI_API_KEY = "AIzaSyC5uHiF8zBnhPkQ9Ph0xx_2OrcugOboc9U"  # Buraya kendi API anahtarınızı girin
genai.configure(api_key=GENAI_API_KEY)

def ask_gemini(prompt):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini API Hatası: {str(e)}")
        return f"Üzgünüm, bir hata oluştu: {str(e)}"
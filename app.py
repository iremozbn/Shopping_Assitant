from flask import Flask, request, jsonify
from flask_cors import CORS
from gemini_api import ask_gemini

app = Flask(__name__)
CORS(app, resources={
    r"/ask": {
        "origins": ["http://localhost:3000"],  # React'ın çalıştığı adres
        "methods": ["POST", "OPTIONS"],  # OPTIONS ekleyin
        "allow_headers": ["Content-Type"]
    }
})

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    question = data.get("question", "")
    response = ask_gemini(question)
    return jsonify({"response": response})

@app.route("/")
def home():
    return "Backend çalışıyor!"
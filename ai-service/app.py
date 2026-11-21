from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import os
from engine import run_matching
from parser import parse_resume

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/health', methods=['GET'])
def health():
    """Liveness & readiness probe."""
    return jsonify({
        "status": "ok",
        "service": "Allocation AI Engine",
        "version": "1.0.0"
    }), 200

@app.route('/match', methods=['POST'])
def match():
    """
    Executes TF-IDF + Cosine Similarity + Quota Constraints + Hungarian Matching.
    Payload: { "interns": [...], "slots": [...] }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Missing JSON request body"}), 400
            
        interns = data.get('interns', [])
        slots = data.get('slots', [])
        weights = data.get('weights') or None
        
        if not isinstance(interns, list) or not isinstance(slots, list):
            return jsonify({"success": False, "error": "Interns and slots must be arrays"}), 400
            
        allocations = run_matching(interns, slots, weights)
        
        return jsonify({
            "success": True,
            "allocations": allocations,
            "totalMatched": len(allocations),
            "totalInternsProcessed": len(interns),
            "totalSlotsProcessed": len(slots)
        }), 200
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"AI Engine execution failed: {str(e)}"
        }), 500

@app.route('/parse-resume', methods=['POST'])
def parse_resume_route():
    """
    Accepts uploaded PDF resume, parses raw text with PyMuPDF,
    and returns matched taxonomy skills and organizations.
    """
    try:
        if 'file' not in request.files:
            return jsonify({"success": False, "error": "No file uploaded in 'file' field"}), 400
            
        uploaded_file = request.files['file']
        if uploaded_file.filename == '':
            return jsonify({"success": False, "error": "Empty filename provided"}), 400
            
        pdf_bytes = uploaded_file.read()
        if not pdf_bytes:
            return jsonify({"success": False, "error": "File buffer is empty"}), 400
            
        parsed_result = parse_resume(pdf_bytes)
        
        return jsonify({
            "success": True,
            "skills": parsed_result.get("skills", []),
            "organizations": parsed_result.get("organizations", []),
            "rawText": parsed_result.get("rawText", "")
        }), 200
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"Resume parsing failed: {str(e)}"
        }), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=False)

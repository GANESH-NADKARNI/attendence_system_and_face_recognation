import os
import face_recognition
import numpy as np
import mysql.connector
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# --- Database Connection ---
def get_db_connection():
    return mysql.connector.connect(
        host=os.environ.get('DB_HOST'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        database=os.environ.get('DB_NAME')
    )

@app.route('/verify', methods=['POST'])
def verify_face():
    data = request.get_json()
    if not data or 'known_descriptor' not in data or 'user_id' not in data:
        return jsonify({'error': 'Missing descriptor or user_id'}), 400

    try:
        live_descriptor = np.array(data['known_descriptor'])
        user_id = data['user_id']

        # Fetch the stored embedding from the database
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT embedding FROM face_embeddings WHERE user_id = %s", (user_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if not result or not result['embedding']:
            return jsonify({'match': False, 'reason': 'No enrolled face found.'})

        stored_descriptor_list = json.loads(result['embedding'])
        stored_descriptor = np.array(stored_descriptor_list)
        
        # Compare the faces
        matches = face_recognition.compare_faces([stored_descriptor], live_descriptor, tolerance=0.6)
        
        return jsonify({'match': bool(matches[0])})

    except Exception as e:
        print(f"Error during verification: {e}")
        return jsonify({'error': 'An internal error occurred.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
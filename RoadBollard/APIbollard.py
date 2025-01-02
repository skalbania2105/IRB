from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# Konfiguracja połączenia z bazą danych
def get_db_connection():
    conn = mysql.connector.connect(user='skalban2', password='zxtTUNDBQZTeTYkW',
                                   host='mysql.agh.edu.pl', database='skalban2')
    return conn

# Endpoint do odbioru wykrycia ruchu od słupka
@app.route('/api/detection', methods=['POST'])
def detect_motion():
    data = request.json
    longitude = data['longitude']
    latitude = data['latitude']

    conn = get_db_connection()
    cursor = conn.cursor()

    # Zapisanie wykrycia do bazy danych
    cursor.execute("""
        INSERT INTO motion_detections (longitude, latitude)
        VALUES (%s, %s)
    """, (longitude, latitude))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Detection saved"}), 200

# Endpoint do pobierania aktywnych zagrożeń
@app.route('/api/active_detections', methods=['GET'])
def get_active_detections():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Pobranie aktywnych wykryć (na podstawie czasu wykrycia i innych kryteriów)
    cursor.execute("""
        SELECT id, detection_time, longitude, latitude 
        FROM motion_detections 
        WHERE detection_time > NOW() - INTERVAL 1 MINUTE
    """)

    results = cursor.fetchall()
    detections = []
    for row in results:
        detections.append({
            "id": row[0],
            "detection_time": row[1],
            "longitude": row[2],
            "latitude": row[3]
        })

    cursor.close()
    conn.close()

    return jsonify(detections), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

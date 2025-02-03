from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS) for frontend interaction

# MySQL connection function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",  # Change to your database host if necessary
        user="root",  # Your MySQL username
        password="sahithi1103",  # Your MySQL password
        database="zomato_db"  # The database you created earlier
    )

# Route to get all restaurants
@app.route('/restaurants', methods=['GET'])
def get_restaurants():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM restaurants')
    restaurants = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(restaurants)

# Route to search restaurants with filters (name, country, cuisine, etc.)
@app.route('/search-restaurants', methods=['GET'])
def search_restaurants():
    country = request.args.get('country_name', '')
    average_spend = request.args.get('average_spend', '')
    cuisine = request.args.get('cuisine', '')
    search_query = request.args.get('search_query', '')
    
    query = "SELECT * FROM restaurants WHERE 1=1"
    params = []

    if country:
        query += " AND country LIKE %s"
        params.append(f"%{country}%")
    
    if average_spend:
        query += " AND average_cost <= %s"
        params.append(average_spend)
    
    if cuisine:
        query += " AND cuisines LIKE %s"
        params.append(f"%{cuisine}%")
    
    if search_query:
        query += " AND (name LIKE %s OR description LIKE %s)"
        params.extend([f"%{search_query}%", f"%{search_query}%"])

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute(query, params)
    restaurants = cursor.fetchall()
    cursor.close()
    connection.close()
    
    return jsonify(restaurants)

if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask server

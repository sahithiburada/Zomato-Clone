from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector


app = Flask(__name__)
CORS(app) 


def get_db_connection():
    return mysql.connector.connect(
        host="localhost", 
        user="root",
        password="sahithi1103",  
        database="zomato_db" 
    )


@app.route('/restaurants', methods=['GET'])
def get_restaurants():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM restaurants')
    restaurants = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(restaurants)

# Route to get a restaurant by ID
@app.route('/restaurant/<int:id>', methods=['GET'])
def get_restaurant(id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM restaurants WHERE restaurant_id = %s', (id,))
    restaurant = cursor.fetchone()
    cursor.close()
    connection.close()
    
    if restaurant:
        return jsonify(restaurant)
    else:
        return jsonify({"error": "Restaurant not found"}), 404

@app.route('/search-restaurants', methods=['GET'])
def search_restaurants():
    # Retrieve all parameters from the request
    search_query = request.args.get('search_query', '')
    country = request.args.get('country', '')
    average_spend = request.args.get('average_spend', '')
    cuisine = request.args.get('cuisine', '')
    latitude = request.args.get('latitude', type=float)
    longitude = request.args.get('longitude', type=float)
    radius = request.args.get('radius', 5)  # Default radius is 10 km if not provided
    
    print(f"Received Search Params: search_query={search_query}, country={country}, avg_spend={average_spend}, cuisine={cuisine}, latitude={latitude}, longitude={longitude}, radius={radius}")

    # Connect to the MySQL database
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Start building the query
    query = "SELECT * FROM restaurants WHERE 1=1"
    params = []

    # Apply filters based on the search query
    if search_query:
        query += " AND name LIKE %s"
        params.append(f"%{search_query}%")

    # Apply filters based on country
    if country:
        query += " AND country = %s"
        params.append(country)

    # Apply filters based on average spend
    if average_spend:
        query += " AND average_cost <= %s"  # Adjusted to <= for more flexibility
        params.append(average_spend)

    # Apply filters based on cuisine
    if cuisine:
        query += " AND cuisines LIKE %s"
        params.append(f"%{cuisine}%")

    # If latitude and longitude are provided, filter based on proximity
    if latitude is not None and longitude is not None:
        query += """
            AND ST_Distance_Sphere(point(longitude, latitude), point(%s, %s)) <= %s * 1000
        """
        params.extend([longitude, latitude, radius])

    # Execute the query with the parameters
    print("Executing SQL Query:", query, "With Params:", params)
    cursor.execute(query, params)
    results = cursor.fetchall()

    # Close database connection
    cursor.close()
    conn.close()

    # Return the results as a JSON response
    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask server
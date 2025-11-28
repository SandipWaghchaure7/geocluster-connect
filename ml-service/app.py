from flask import Flask, request, jsonify
from flask_cors import CORS
from clustering.location_cluster import cluster_by_location
from clustering.interest_cluster import cluster_by_interest
from clustering.utils import format_cluster_response, validate_users_data
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ML Service is running'}), 200

@app.route('/api/cluster/location', methods=['POST'])
def cluster_location():
    """
    Cluster users by location
    Expected data: { users: [...], max_distance: 1.0 }
    """
    try:
        data = request.json
        users = data.get('users', [])
        max_distance = data.get('max_distance', 1.0)  # km
        
        # Validate data
        is_valid, error_msg = validate_users_data(users, 'location')
        if not is_valid:
            return jsonify({
                'success': False,
                'message': error_msg
            }), 400
        
        # Perform clustering
        clusters = cluster_by_location(users, max_distance)
        
        # Format response
        response = format_cluster_response(clusters, 'location')
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/cluster/interest', methods=['POST'])
def cluster_interest():
    """
    Cluster users by interests
    Expected data: { users: [...], n_clusters: 3 }
    """
    try:
        data = request.json
        users = data.get('users', [])
        n_clusters = data.get('n_clusters', 3)
        
        # Validate data
        is_valid, error_msg = validate_users_data(users, 'interest')
        if not is_valid:
            return jsonify({
                'success': False,
                'message': error_msg
            }), 400
        
        # Perform clustering
        clusters = cluster_by_interest(users, n_clusters)
        
        # Format response
        response = format_cluster_response(clusters, 'interest')
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    """Test endpoint to verify ML service is working"""
    return jsonify({
        'message': 'ML Service is working correctly',
        'endpoints': {
            'location_clustering': '/api/cluster/location',
            'interest_clustering': '/api/cluster/interest'
        }
    }), 200

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
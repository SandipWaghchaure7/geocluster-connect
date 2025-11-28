import numpy as np
from sklearn.cluster import DBSCAN
from math import radians, sin, cos, sqrt, atan2

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points on Earth in kilometers"""
    R = 6371  # Earth's radius in kilometers
    
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    distance = R * c
    
    return distance

def cluster_by_location(users, max_distance_km=1.0):
    """
    Cluster users based on their location using DBSCAN
    
    Args:
        users: List of user objects with location data
        max_distance_km: Maximum distance in km to consider users as neighbors
    
    Returns:
        List of clusters with user IDs
    """
    if not users or len(users) < 2:
        return []
    
    # Extract coordinates
    coordinates = []
    user_ids = []
    
    for user in users:
        if 'location' in user and 'coordinates' in user['location']:
            coords = user['location']['coordinates']
            if len(coords) == 2 and coords[0] != 0 and coords[1] != 0:
                # MongoDB stores as [longitude, latitude]
                coordinates.append([coords[1], coords[0]])  # [lat, lon]
                user_ids.append(user['_id'])
    
    if len(coordinates) < 2:
        return []
    
    # Convert to numpy array
    coords_array = np.array(coordinates)
    
    # DBSCAN clustering
    # eps is in radians, convert km to radians (approximately)
    eps_radians = max_distance_km / 6371.0  # Earth radius in km
    
    db = DBSCAN(eps=eps_radians, min_samples=2, metric='haversine')
    labels = db.fit_predict(np.radians(coords_array))
    
    # Organize clusters
    clusters = {}
    for idx, label in enumerate(labels):
        if label != -1:  # -1 means noise/outlier
            if label not in clusters:
                clusters[label] = []
            clusters[label].append(user_ids[idx])
    
    # Convert to list format
    result = []
    for cluster_id, member_ids in clusters.items():
        if len(member_ids) >= 2:  # Only include clusters with 2+ members
            result.append({
                'cluster_id': int(cluster_id),
                'member_ids': member_ids,
                'size': len(member_ids)
            })
    
    return result
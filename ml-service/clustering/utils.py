def format_cluster_response(clusters, cluster_type):
    """
    Format cluster data for API response
    
    Args:
        clusters: List of clusters from clustering algorithms
        cluster_type: 'location' or 'interest'
    
    Returns:
        Formatted response
    """
    if not clusters:
        return {
            'success': False,
            'message': 'No clusters found. Need at least 2 users with valid data.',
            'clusters': []
        }
    
    return {
        'success': True,
        'cluster_type': cluster_type,
        'total_clusters': len(clusters),
        'clusters': clusters
    }

def validate_users_data(users, cluster_type):
    """
    Validate user data before clustering
    
    Args:
        users: List of user objects
        cluster_type: 'location' or 'interest'
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not users:
        return False, 'No users provided'
    
    if len(users) < 2:
        return False, 'Need at least 2 users for clustering'
    
    if cluster_type == 'location':
        valid_count = 0
        for user in users:
            if 'location' in user and 'coordinates' in user['location']:
                coords = user['location']['coordinates']
                if len(coords) == 2 and coords[0] != 0 and coords[1] != 0:
                    valid_count += 1
        
        if valid_count < 2:
            return False, 'Need at least 2 users with valid location data'
    
    elif cluster_type == 'interest':
        valid_count = 0
        for user in users:
            if 'interests' in user and user['interests']:
                valid_count += 1
        
        if valid_count < 2:
            return False, 'Need at least 2 users with interests'
    
    return True, None
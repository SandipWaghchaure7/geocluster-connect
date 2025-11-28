import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity

def cluster_by_interest(users, n_clusters=3):
    """
    Cluster users based on their interests using K-Means
    
    Args:
        users: List of user objects with interests
        n_clusters: Number of clusters to create
    
    Returns:
        List of clusters with user IDs
    """
    if not users or len(users) < 2:
        return []
    
    # Extract interests
    user_interests = []
    user_ids = []
    
    for user in users:
        if 'interests' in user and user['interests']:
            # Join interests into a single string
            interests_text = ' '.join(user['interests'])
            user_interests.append(interests_text)
            user_ids.append(user['_id'])
        else:
            # No interests - add empty string
            user_interests.append('')
            user_ids.append(user['_id'])
    
    if len(user_interests) < 2:
        return []
    
    # Remove users with no interests
    valid_users = [(uid, interests) for uid, interests in zip(user_ids, user_interests) if interests]
    
    if len(valid_users) < 2:
        return []
    
    user_ids, user_interests = zip(*valid_users)
    
    # Adjust n_clusters if necessary
    n_clusters = min(n_clusters, len(user_ids))
    
    if n_clusters < 2:
        return []
    
    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer(max_features=50)
    interest_vectors = vectorizer.fit_transform(user_interests)
    
    # K-Means Clustering
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(interest_vectors)
    
    # Organize clusters
    clusters = {}
    for idx, label in enumerate(labels):
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

def find_similar_users(user_interests, all_users, top_n=5):
    """
    Find users with similar interests using cosine similarity
    
    Args:
        user_interests: List of current user's interests
        all_users: List of all user objects with interests
        top_n: Number of similar users to return
    
    Returns:
        List of user IDs sorted by similarity
    """
    if not user_interests or not all_users:
        return []
    
    user_interests_text = ' '.join(user_interests)
    
    all_interests = [user_interests_text]
    user_ids = [None]  # Placeholder for current user
    
    for user in all_users:
        if 'interests' in user and user['interests']:
            interests_text = ' '.join(user['interests'])
            all_interests.append(interests_text)
            user_ids.append(user['_id'])
    
    if len(all_interests) < 2:
        return []
    
    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer(max_features=50)
    interest_vectors = vectorizer.fit_transform(all_interests)
    
    # Calculate cosine similarity
    similarities = cosine_similarity(interest_vectors[0:1], interest_vectors[1:]).flatten()
    
    # Get top N similar users
    top_indices = similarities.argsort()[-top_n:][::-1]
    similar_user_ids = [user_ids[i+1] for i in top_indices if similarities[i] > 0]
    
    return similar_user_ids
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compare_all_files(file_data, ngram_bounds):
    """
    Language-agnostic TF-IDF comparison engine.
    ngram_bounds is a tuple (e.g., (2,4) for Python, (3,5) for Java)
    """
    if len(file_data) < 2: 
        return []

    documents = [f['doc'] for f in file_data]
    filenames = [f['name'] for f in file_data]
    tokens_list = [f['tokens'] for f in file_data] # Pre-parsed tokens passed from the engine

    vectorizer = TfidfVectorizer(ngram_range=ngram_bounds, sublinear_tf=True)
    
    try:
        tfidf_matrix = vectorizer.fit_transform(documents)
        sim_matrix = cosine_similarity(tfidf_matrix)
        feature_names = vectorizer.get_feature_names_out()

        results = []
        for i in range(len(filenames)):
            for j in range(i + 1, len(filenames)):
                score = round(sim_matrix[i][j] * 100, 2)
                
                status = "Low"
                if score > 70: 
                    status = "High"
                elif score > 40: 
                    status = "Medium"

                if score > 0:
                    vec_i = tfidf_matrix[i].toarray()[0]
                    vec_j = tfidf_matrix[j].toarray()[0]

                    shared_ngrams = set()
                    for idx in range(len(feature_names)):
                        if vec_i[idx] > 0 and vec_j[idx] > 0:
                            shared_ngrams.add(feature_names[idx])

                    tokens_i = tokens_list[i]
                    tokens_j = tokens_list[j]

                    def extract_lines_from_tfidf(tokens, shared_set):
                        highlighted_lines = set()
                        # Dynamically check N-Grams based on the bounds (e.g., 5 down to 3 for Java)
                        for n in range(ngram_bounds[1], ngram_bounds[0] - 1, -1): 
                            for k in range(len(tokens) - n + 1):
                                ngram_str = " ".join([t[0].lower() for t in tokens[k:k+n]])
                                if ngram_str in shared_set:
                                    for t in tokens[k:k+n]:
                                        highlighted_lines.add(t[1])
                        return list(highlighted_lines)

                    lines_i = extract_lines_from_tfidf(tokens_i, shared_ngrams)
                    lines_j = extract_lines_from_tfidf(tokens_j, shared_ngrams)

                    results.append({
                        "file1": filenames[i], 
                        "file2": filenames[j], 
                        "score": score, 
                        "status": status,
                        "lines1": lines_i, 
                        "lines2": lines_j,
                        "ast1": [t[0] for t in tokens_i[:20]], # Expose first 20 tokens for UI Visualizer
                        "ast2": [t[0] for t in tokens_j[:20]]
                    })
        
        return sorted(results, key=lambda x: x['score'], reverse=True)
    except ValueError:
        return []
    except Exception as e:
        print(f"Comparison Error: {str(e)}")
        return []
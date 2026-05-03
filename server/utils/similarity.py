from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def compare_all_files(file_data, ngram_bounds):
    if len(file_data) < 2: 
        return []

    documents = [f['doc'] for f in file_data]
    filenames = [f['name'] for f in file_data]
    tokens_list = [f['tokens'] for f in file_data] 

    # Dynamic max_df safely filters out boilerplate for large batches
    dynamic_max_df = 1.0 if len(documents) <= 5 else 0.85

    vectorizer = TfidfVectorizer(
        ngram_range=ngram_bounds, 
        sublinear_tf=True, 
        max_df=dynamic_max_df 
    )
    
    try:
        tfidf_matrix = vectorizer.fit_transform(documents)
        sim_matrix = cosine_similarity(tfidf_matrix)
        feature_names = vectorizer.get_feature_names_out()
        
        idf_weights = vectorizer.idf_
        ngram_weight_map = dict(zip(feature_names, idf_weights))

        results = []
        for i in range(len(filenames)):
            for j in range(i + 1, len(filenames)):
                score = round(sim_matrix[i][j] * 100, 2)
                
                if score > 0:
                    vec_i = tfidf_matrix[i].toarray()[0]
                    vec_j = tfidf_matrix[j].toarray()[0]

                    # --- NEW MATH: CONTAINMENT SKELETON METRIC ---
                    weight_i = np.sum(vec_i)
                    weight_j = np.sum(vec_j)
                    
                    shared_weight = np.sum([min(vec_i[idx], vec_j[idx]) for idx in range(len(feature_names))])
                    
                    if min(weight_i, weight_j) > 0:
                        containment_score = round((shared_weight / min(weight_i, weight_j)) * 100, 2)
                    else:
                        containment_score = 0.0
                    
                    # Use the HIGHER of the two scores for the final output
                    final_score = max(score, containment_score)
                    
                    status = "Low"
                    if final_score > 80: 
                        status = "High"
                    elif final_score >= 50: 
                        status = "Medium"

                    shared_ngrams = set()
                    for idx in range(len(feature_names)):
                        if vec_i[idx] > 0 and vec_j[idx] > 0:
                            shared_ngrams.add(feature_names[idx])

                    tokens_i = tokens_list[i]
                    tokens_j = tokens_list[j]

                    def extract_lines_from_tfidf(tokens, shared_set):
                        highlighted_lines = set()
                        for n in range(ngram_bounds[1], ngram_bounds[0] - 1, -1): 
                            for k in range(len(tokens) - n + 1):
                                ngram_str = " ".join([t[0].lower() for t in tokens[k:k+n]])
                                if ngram_str in shared_set:
                                    for t in tokens[k:k+n]:
                                        highlighted_lines.add(t[1])
                        return list(highlighted_lines)

                    lines_i = extract_lines_from_tfidf(tokens_i, shared_ngrams)
                    lines_j = extract_lines_from_tfidf(tokens_j, shared_ngrams)

                    # --- Synchronized Shared Patterns + Representative Sample ---
                    def get_top_shared_patterns(tokens_for_case, shared_set, ngram_size=3):
                        extracted_patterns = {}
                        max_possible_idf = np.log(len(documents)) + 1
                        
                        for k in range(len(tokens_for_case) - ngram_size + 1):
                            original_sequence = [t[0] for t in tokens_for_case[k:k+ngram_size]]
                            ngram_str = " ".join(s.lower() for s in original_sequence)
                            
                            if ngram_str in shared_set and ngram_str not in extracted_patterns:
                                real_weight = ngram_weight_map.get(ngram_str, 0.0)
                                normalized_score = round((real_weight / max_possible_idf) * 100, 2) if max_possible_idf > 0 else 0
                                
                                extracted_patterns[ngram_str] = {
                                    "sequence": original_sequence,
                                    "weight": normalized_score,
                                    "is_shared": True
                                }
                                
                        suspicious_patterns = sorted(extracted_patterns.values(), key=lambda x: x['weight'], reverse=True)
                        total_patterns = len(suspicious_patterns)

                        if total_patterns <= 40:
                            return suspicious_patterns

                        representative_sample = suspicious_patterns[:20]
                        mid_index = total_patterns // 2
                        representative_sample.extend(suspicious_patterns[mid_index : mid_index + 5])
                        representative_sample.extend(suspicious_patterns[-5:])

                        return representative_sample

                    top_shared_patterns = get_top_shared_patterns(tokens_i, shared_ngrams, ngram_size=3)

                    results.append({
                        "file1": filenames[i], 
                        "file2": filenames[j], 
                        "score": final_score, # This now sends the optimized score to the React UI
                        "status": status,
                        "lines1": lines_i, 
                        "lines2": lines_j,
                        "ast_xai_1": top_shared_patterns, 
                        "ast_xai_2": top_shared_patterns  
                    })
        
        return sorted(results, key=lambda x: x['score'], reverse=True)
    except ValueError as e:
        print(f"TF-IDF Vectorizer Warning: {str(e)}")
        return []
    except Exception as e:
        print(f"Comparison Error: {str(e)}")
        return []
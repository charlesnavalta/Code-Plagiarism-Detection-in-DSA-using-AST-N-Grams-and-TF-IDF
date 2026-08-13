def monolithic_sort(arr):
    """
    Sorts an array using a monolithic Selection Sort algorithm.
    Baseline script for TS-B Level 2: Method Extraction.
    """
    n = len(arr)
    
    for i in range(n):
        # --- BLOCK TO BE EXTRACTED ---
        # In the obfuscated version, this entire process of finding 
        # the minimum index will be moved to a separate helper function.
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        # -----------------------------
                
        # Swap the found minimum element with the first element
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
        
    return arr


if __name__ == "__main__":
    sample_data = [64, 25, 12, 22, 11]
    print("Original array:", sample_data)
    print("Sorted array:", monolithic_sort(sample_data))
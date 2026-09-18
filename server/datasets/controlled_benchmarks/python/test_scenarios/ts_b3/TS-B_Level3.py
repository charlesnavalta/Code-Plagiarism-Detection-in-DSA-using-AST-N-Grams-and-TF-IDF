def sum_even_numbers(arr):
    """
    Calculates the sum of all even numbers in a list using a FOR loop.
    Baseline script for TS-B Level 3: Control Flow Replacement.
    """
    total_sum = 0
    
    # --- The Baseline Control Flow ---
    for num in arr:
        # The inner logic that remains structurally identical
        if num % 2 == 0:
            total_sum += num
            
    return total_sum


if __name__ == "__main__":
    sample_data = [12, 5, 8, 13, 20, 7]
    print("Array:", sample_data)
    print("Sum of even numbers (For Loop):", sum_even_numbers(sample_data))
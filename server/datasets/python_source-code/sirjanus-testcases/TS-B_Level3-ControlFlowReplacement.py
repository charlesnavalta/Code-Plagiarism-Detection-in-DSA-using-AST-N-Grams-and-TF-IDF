def compute_even_total(sequence):
    """
    Calculates the sum of all even numbers using a WHILE loop.
    Obfuscated script for TS-B Level 3: Control Flow Replacement.
    """
    running_total = 0
    
    # --- The Replaced Control Flow ---
    index = 0
    while index < len(sequence):
        current_val = sequence[index]
        
        # The inner logic remains structurally identical
        if current_val % 2 == 0:
            running_total += current_val
            
        index += 1
        
    return running_total


if __name__ == "__main__":
    test_numbers = [12, 5, 8, 13, 20, 7]
    print("Sequence:", test_numbers)
    print("Sum of even numbers (While Loop):", compute_even_total(test_numbers))
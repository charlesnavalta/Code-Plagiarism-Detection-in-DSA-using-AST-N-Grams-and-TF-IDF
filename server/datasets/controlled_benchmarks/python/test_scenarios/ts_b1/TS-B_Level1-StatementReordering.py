def generate_fibonacci(n):
    """
    Generates a Fibonacci sequence up to 'n' terms.
    Baseline script for TS-B Level 1: Statement Reordering.
    """
    if n <= 0:
        return []
    if n == 1:
        return [0]

    # --- INDEPENDENT ASSIGNMENTS ---
    # These are the statements that will be swapped in the obfuscated version
    first_term = 1
    second_term = 2
    
    sequence = [first_term, second_term]
    
    for i in range(2, n):
        next_term = first_term + second_term
        sequence.append(next_term)
        
        # Update terms for the next iteration
        first_term = second_term
        second_term = next_term
        
    return sequence


if __name__ == "__main__":
    num_terms = 10
    print(f"Fibonacci sequence up to {num_terms} terms:")
    print(generate_fibonacci(num_terms))
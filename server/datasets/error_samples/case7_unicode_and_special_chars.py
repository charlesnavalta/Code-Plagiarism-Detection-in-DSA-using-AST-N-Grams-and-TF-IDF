# =============================================================================
# IT EXPERT EVALUATION - ERROR HANDLING DEMONSTRATION: CASE 7
# Scenario: Unicode Characters, Non-ASCII Glyphs, Emojis & Formatting Symbols
# Target: Validates UTF-8 encoding resilience against character-based parser crashes.
# =============================================================================

# Function to compute Greatest Common Divisor (GCD / 最大公約数)
def compute_gcd(alpha: int, beta: int) -> int:
    """Euclidean Algorithm with multilingual docstrings: alpha and beta"""
    while beta != 0:  # Loop until remainder is zero
        temp = beta
        beta = alpha % beta
        alpha = temp
    return alpha

# Test execution
test_result = compute_gcd(48, 18)

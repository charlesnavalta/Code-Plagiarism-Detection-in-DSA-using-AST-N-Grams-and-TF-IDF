def process_numbers(numbers):
    """
    Student 3: Independent organic solution written with Python built-ins
    and list comprehensions. Completely different structure and logic flow.
    """
    # Filter valid positive numbers first
    positives = [x for x in numbers if x > 0]

    # Filter even numbers
    positive_evens = [x * 2 for x in positives if x % 2 == 0]
    odd_count = sum(1 for x in positives if x % 2 != 0)

    # Calculate sum and average
    even_sum = sum(x for x in positives if x % 2 == 0)
    total_sum = even_sum + odd_count

    even_count = len(positive_evens)
    avg = (total_sum / even_count) if even_count > 0 else 0

    return {
        "evens": positive_evens,
        "total_sum": total_sum,
        "average": avg
    }


if __name__ == "__main__":
    sample_data = [12, -4, 7, 18, 0, 22, -9, 14]
    print("Processed Result:", process_numbers(sample_data))

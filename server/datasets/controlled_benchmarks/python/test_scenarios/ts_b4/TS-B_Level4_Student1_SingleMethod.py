def process_numbers(numbers):
    """
    Student 1: Complete processing implemented inside a single monolithic method.
    Iterates through numbers with an if-else loop to categorize, accumulate, and transform values.
    """
    total_sum = 0
    even_count = 0
    positive_evens = []

    for num in numbers:
        if num > 0:
            if num % 2 == 0:
                positive_evens.append(num * 2)
                total_sum += num
                even_count += 1
            else:
                total_sum += 1
        else:
            print("Skipping non-positive value: " + str(num))

    average = total_sum / even_count if even_count > 0 else 0
    return {
        "evens": positive_evens,
        "total_sum": total_sum,
        "average": average
    }


if __name__ == "__main__":
    sample_data = [12, -4, 7, 18, 0, 22, -9, 14]
    print("Processed Result:", process_numbers(sample_data))

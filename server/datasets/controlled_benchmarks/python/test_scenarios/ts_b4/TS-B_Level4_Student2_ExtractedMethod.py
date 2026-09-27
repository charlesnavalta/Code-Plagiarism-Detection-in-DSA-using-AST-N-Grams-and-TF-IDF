def filter_and_evaluate(items):
    """
    Student 2: Helper function containing the extracted loop and if-else logic.
    Copied from Student 1 with renamed local variables, but preserving structural AST flow.
    """
    tot = 0
    count = 0
    evens_list = []

    for val in items:
        if val > 0:
            if val % 2 == 0:
                evens_list.append(val * 2)
                tot += val
                count += 1
            else:
                tot += 1
        else:
            print("Skipping non-positive value: " + str(val))

    return tot, count, evens_list


def process_numbers(numbers):
    """
    Student 2: Main method delegating the if-else loop to the extracted helper method.
    """
    tot, count, evens_list = filter_and_evaluate(numbers)
    avg = tot / count if count > 0 else 0
    return {
        "evens": evens_list,
        "total_sum": tot,
        "average": avg
    }


if __name__ == "__main__":
    sample_data = [12, -4, 7, 18, 0, 22, -9, 14]
    print("Processed Result:", process_numbers(sample_data))

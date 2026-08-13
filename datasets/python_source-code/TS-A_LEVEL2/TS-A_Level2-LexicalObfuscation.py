def fast_sort(sequence):
    if len(sequence) <= 1:
        return sequence

    divider = sequence[-1]
    smaller_items = []
    larger_items = []

    for index in range(len(sequence) - 1):
        if sequence[index] <= divider:
            smaller_items.append(sequence[index])
        else:
            larger_items.append(sequence[index])

    return fast_sort(smaller_items) + [divider] + fast_sort(larger_items)


if __name__ == "__main__":
    sample_numbers = [10, 7, 8, 9, 1, 5]
    print(fast_sort(sample_numbers))
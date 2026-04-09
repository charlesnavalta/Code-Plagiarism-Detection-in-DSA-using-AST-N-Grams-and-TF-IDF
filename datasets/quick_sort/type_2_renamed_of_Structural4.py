def fast_sort(sequence):
    if len(sequence) <= 1:
        return sequence

    anchor = sequence[-1]
    lower_half, upper_half = split_data(sequence[:-1], anchor)

    return fast_sort(lower_half) + [anchor] + fast_sort(upper_half)


def split_data(sequence, anchor):
    items_below = []
    items_above = []

    for item in sequence:
        if item <= anchor:
            items_below.append(item)
        else:
            items_above.append(item)

    return items_below, items_above
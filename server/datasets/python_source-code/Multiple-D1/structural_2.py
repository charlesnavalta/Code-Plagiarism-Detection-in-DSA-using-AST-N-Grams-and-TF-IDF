"""
Quick Sort - Structural Modification #2
Derived from organic_5: inverted conditional, swapped recursion order.
"""

def calc_median(items, start, end):
    center = (start + end) // 2
    if items[center] < items[start]:
        items[start], items[center] = items[center], items[start]
    if items[end] < items[start]:
        items[start], items[end] = items[end], items[start]
    if items[end] < items[center]:
        items[center], items[end] = items[end], items[center]
    items[center], items[end - 1] = items[end - 1], items[center]
    return items[end - 1]

def split_median(items, start, end):
    anchor = calc_median(items, start, end)
    l_ptr = start
    r_ptr = end - 1
    while l_ptr < r_ptr:
        l_ptr += 1
        while items[l_ptr] < anchor:
            l_ptr += 1
        r_ptr -= 1
        while items[r_ptr] > anchor:
            r_ptr -= 1
        if l_ptr >= r_ptr:
            break
        items[l_ptr], items[r_ptr] = items[r_ptr], items[l_ptr]
    items[l_ptr], items[end - 1] = items[end - 1], items[l_ptr]
    return l_ptr

def quick_sort_median(items, start, end):
    if end - start < 10:
        for idx in range(start + 1, end + 1):
            val = items[idx]
            pos = idx - 1
            while pos >= start and items[pos] > val:
                items[pos + 1] = items[pos]
                pos -= 1
            items[pos + 1] = val
    else:
        pivot_idx = split_median(items, start, end)
        quick_sort_median(items, pivot_idx + 1, end)
        quick_sort_median(items, start, pivot_idx - 1)

if __name__ == "__main__":
    vals = [24, 2, 45, 20, 56, 75, 2, 56, 99, 53, 12]
    quick_sort_median(vals, 0, len(vals) - 1)
    print(vals)

# Organic MergeSort Student Submission 02
def iterative_merge_sort(arr):
    n = len(arr)
    width = 1
    while width < n:
        for i in range(0, n, 2 * width):
            left = arr[i:i + width]
            right = arr[i + width:i + 2 * width]
            merged = []
            l = r = 0
            while l < len(left) and r < len(right):
                if left[l] <= right[r]:
                    merged.append(left[l]); l += 1
                else:
                    merged.append(right[r]); r += 1
            merged.extend(left[l:])
            merged.extend(right[r:])
            arr[i:i + len(merged)] = merged
        width *= 2
    return arr

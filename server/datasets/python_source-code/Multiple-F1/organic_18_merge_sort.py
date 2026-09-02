# Organic MergeSort Student Submission 18
def merge_in_place(arr, start, mid, end):
    start2 = mid + 1
    if arr[mid] <= arr[start2]:
        return
    while start <= mid and start2 <= end:
        if arr[start] <= arr[start2]:
            start += 1
        else:
            val = arr[start2]
            index = start2
            while index != start:
                arr[index] = arr[index - 1]
                index -= 1
            arr[start] = val
            start += 1; mid += 1; start2 += 1

def in_place_merge_sort(arr, l=0, r=None):
    if r is None: r = len(arr) - 1
    if l < r:
        m = l + (r - l) // 2
        in_place_merge_sort(arr, l, m)
        in_place_merge_sort(arr, m + 1, r)
        merge_in_place(arr, l, m, r)
    return arr

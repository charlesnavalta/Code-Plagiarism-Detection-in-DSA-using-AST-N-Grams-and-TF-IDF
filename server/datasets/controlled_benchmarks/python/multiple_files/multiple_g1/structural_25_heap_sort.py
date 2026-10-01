def swap_elements(data, p, q):
    data[p], data[q] = data[q], data[p]

def sift_down_rec(data, total, idx):
    max_idx = idx
    r = 2 * idx + 2
    l = 2 * idx + 1
    if r < total and data[r] > data[max_idx]:
        max_idx = r
    if l < total and data[l] > data[max_idx]:
        max_idx = l
    if max_idx != idx:
        swap_elements(data, idx, max_idx)
        sift_down_rec(data, total, max_idx)

def build_max_heap(data):
    n = len(data)
    for k in range(n // 2 - 1, -1, -1):
        sift_down_rec(data, n, k)

def heap_sort(data):
    n = len(data)
    build_max_heap(data)
    for k in range(n - 1, 0, -1):
        swap_elements(data, 0, k)
        sift_down_rec(data, k, 0)
    return data

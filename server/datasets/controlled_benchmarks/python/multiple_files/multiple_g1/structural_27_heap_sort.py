def heap_sort(arr):
    length = len(arr)
    init_heap(arr)
    for step in range(length - 1, 0, -1):
        arr[step], arr[0] = arr[0], arr[step]
        push_down(arr, step, 0)
    return arr

def init_heap(arr):
    sz = len(arr)
    for idx in range((sz - 2) // 2, -1, -1):
        push_down(arr, sz, idx)

def push_down(arr, bound, cur):
    cand = cur
    l_sub = 2 * cur + 1
    r_sub = 2 * cur + 2
    if l_sub < bound and arr[cand] < arr[l_sub]:
        cand = l_sub
    if r_sub < bound and arr[cand] < arr[r_sub]:
        cand = r_sub
    if cand != cur:
        arr[cand], arr[cur] = arr[cur], arr[cand]
        push_down(arr, bound, cand)

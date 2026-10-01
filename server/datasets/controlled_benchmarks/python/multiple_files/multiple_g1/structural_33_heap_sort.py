def find_winner(arr, bound, cur):
    winner = cur
    lc = 2 * cur + 1
    rc = 2 * cur + 2
    if lc < bound and arr[lc] > arr[winner]:
        winner = lc
    if rc < bound and arr[rc] > arr[winner]:
        winner = rc
    return winner

def heap_sort(arr):
    n = len(arr)
    def heapify_sub(bound, cur):
        target = find_winner(arr, bound, cur)
        if target != cur:
            arr[cur], arr[target] = arr[target], arr[cur]
            heapify_sub(bound, target)

    i = n // 2 - 1
    while i >= 0:
        heapify_sub(n, i)
        i -= 1
    for k in range(n - 1, 0, -1):
        arr[k], arr[0] = arr[0], arr[k]
        heapify_sub(k, 0)
    return arr

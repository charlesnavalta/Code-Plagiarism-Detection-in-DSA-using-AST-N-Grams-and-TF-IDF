def sift_down_branch(items, n, i):
    l = 2 * i + 1
    r = 2 * i + 2
    if l >= n:
        return
    highest = r if (r < n and items[r] > items[l]) else l
    if items[highest] > items[i]:
        items[i], items[highest] = items[highest], items[i]
        sift_down_branch(items, n, highest)

def heap_sort(items):
    n = len(items)
    for k in range(n // 2 - 1, -1, -1):
        sift_down_branch(items, n, k)
    for k in range(n - 1, 0, -1):
        items[0], items[k] = items[k], items[0]
        sift_down_branch(items, k, 0)
    return items

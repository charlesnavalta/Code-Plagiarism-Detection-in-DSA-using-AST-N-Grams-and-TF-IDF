def sift(items, sz, root):
    top = root
    left_c = 2 * root + 1
    right_c = left_c + 1
    if left_c < sz and items[left_c] > items[top]:
        top = left_c
    if right_c < sz and items[right_c] > items[top]:
        top = right_c
    if top != root:
        items[root], items[top] = items[top], items[root]
        sift(items, sz, top)

def heap_sort(items):
    sz = len(items)
    for p in reversed(range(sz // 2)):
        sift(items, sz, p)
    for p in range(sz - 1, 0, -1):
        items[0], items[p] = items[p], items[0]
        sift(items, p, 0)
    return items

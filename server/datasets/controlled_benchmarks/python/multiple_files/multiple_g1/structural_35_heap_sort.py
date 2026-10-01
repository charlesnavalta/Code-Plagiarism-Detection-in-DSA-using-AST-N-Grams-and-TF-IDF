def swap_node(coll, i, j):
    tmp = coll[i]
    coll[i] = coll[j]
    coll[j] = tmp

def heap_sort(coll):
    total = len(coll)
    for i in range(total // 2 - 1, -1, -1):
        sift_down_node(coll, total, i)
    for i in range(total - 1, 0, -1):
        swap_node(coll, 0, i)
        sift_down_node(coll, i, 0)
    return coll

def sift_down_node(coll, total, i):
    m = i
    l = 2 * i + 1
    r = 2 * i + 2
    if l < total and coll[l] > coll[m]:
        m = l
    if r < total and coll[r] > coll[m]:
        m = r
    if m != i:
        swap_node(coll, i, m)
        sift_down_node(coll, total, m)

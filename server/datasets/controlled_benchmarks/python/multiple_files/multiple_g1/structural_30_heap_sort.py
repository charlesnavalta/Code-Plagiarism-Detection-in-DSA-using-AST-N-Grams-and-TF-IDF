def heap_sort(a):
    sz = len(a)
    def sink(lim, node):
        lead = node
        ch1 = 2 * node + 1
        ch2 = 2 * node + 2
        if ch1 < lim and a[ch1] > a[lead]:
            lead = ch1
        if ch2 < lim and a[ch2] > a[lead]:
            lead = ch2
        if lead != node:
            a[node], a[lead] = a[lead], a[node]
            sink(lim, lead)

    for i in range(sz // 2 - 1, -1, -1):
        sink(sz, i)
    for i in range(sz - 1, 0, -1):
        a[i], a[0] = a[0], a[i]
        sink(i, 0)
    return a

def heapify_node(elements, total, pos):
    curr = pos
    while True:
        target = curr
        c1 = 2 * curr + 1
        c2 = 2 * curr + 2
        if c1 < total and elements[c1] > elements[target]:
            target = c1
        if c2 < total and elements[c2] > elements[target]:
            target = c2
        if target == curr:
            break
        elements[curr], elements[target] = elements[target], elements[curr]
        curr = target

def heap_sort(elements):
    count = len(elements)
    for idx in range(count // 2 - 1, -1, -1):
        heapify_node(elements, count, idx)
    for idx in range(count - 1, 0, -1):
        elements[idx], elements[0] = elements[0], elements[idx]
        heapify_node(elements, idx, 0)
    return elements

def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    l, r = merge_sort(arr[:mid]), merge_sort(arr[mid:])
    res = []
    while l and r:
        if l[0] <= r[0]:
            res.append(l.pop(0))
        else:
            res.append(r.pop(0))
    if l:
        res.extend(l)
    if r:
        res.extend(r)
    return res

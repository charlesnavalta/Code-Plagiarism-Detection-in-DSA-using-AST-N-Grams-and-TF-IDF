def merge_sort(data_list):
    if not data_list: return data_list
    n = len(data_list)
    step = 1
    while step < n:
        for offset in range(0, n, 2 * step):
            l = data_list[offset : offset + step]
            r = data_list[offset + step : offset + 2 * step]
            temp = []
            while l and r:
                temp.append(l.pop(0) if l[0] <= r[0] else r.pop(0))
            temp.extend(l or r)
            data_list[offset : offset + len(temp)] = temp
        step *= 2
    return data_list

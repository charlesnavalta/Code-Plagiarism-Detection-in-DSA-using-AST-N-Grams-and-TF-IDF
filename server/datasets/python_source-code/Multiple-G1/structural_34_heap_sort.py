def swp_9(lst_9, i, j):
    temp_val_9 = lst_9[i]
    lst_9[i] = lst_9[j]
    lst_9[j] = temp_val_9

def hpf_9(lst_9, n, i):
    r_idx_9 = 2 * i + 2
    l_idx_9 = 2 * i + 1
    max_idx_9 = i
    if r_idx_9 < n and lst_9[r_idx_9] > lst_9[max_idx_9]:
        max_idx_9 = r_idx_9
    if l_idx_9 < n and lst_9[l_idx_9] > lst_9[max_idx_9]:
        max_idx_9 = l_idx_9
    if max_idx_9 != i:
        swp_9(lst_9, i, max_idx_9)
        hpf_9(lst_9, n, max_idx_9)

def bmh_9(lst_9):
    n = len(lst_9)
    for i in range(n // 2 - 1, -1, -1):
        hpf_9(lst_9, n, i)

def hsort_9(lst_9):
    n = len(lst_9)
    bmh_9(lst_9)
    for i in range(n - 1, 0, -1):
        swp_9(lst_9, i, 0)
        hpf_9(lst_9, i, 0)
    return lst_9

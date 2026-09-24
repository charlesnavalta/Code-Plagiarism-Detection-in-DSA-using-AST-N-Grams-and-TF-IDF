def swp_6(lst_6, i, j):
    temp_val_6 = lst_6[i]
    lst_6[i] = lst_6[j]
    lst_6[j] = temp_val_6

def hpf_6(lst_6, n, i):
    r_idx_6 = 2 * i + 2
    l_idx_6 = 2 * i + 1
    max_idx_6 = i
    if r_idx_6 < n and lst_6[r_idx_6] > lst_6[max_idx_6]:
        max_idx_6 = r_idx_6
    if l_idx_6 < n and lst_6[l_idx_6] > lst_6[max_idx_6]:
        max_idx_6 = l_idx_6
    if max_idx_6 != i:
        swp_6(lst_6, i, max_idx_6)
        hpf_6(lst_6, n, max_idx_6)

def bmh_6(lst_6):
    n = len(lst_6)
    for i in range(n // 2 - 1, -1, -1):
        hpf_6(lst_6, n, i)

def hsort_6(lst_6):
    n = len(lst_6)
    bmh_6(lst_6)
    for i in range(n - 1, 0, -1):
        swp_6(lst_6, i, 0)
        hpf_6(lst_6, i, 0)
    return lst_6

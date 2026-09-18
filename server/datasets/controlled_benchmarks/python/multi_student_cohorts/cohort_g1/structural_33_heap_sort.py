def swp_8(lst_8, i, j):
    temp_val_8 = lst_8[i]
    lst_8[i] = lst_8[j]
    lst_8[j] = temp_val_8

def hpf_8(lst_8, n, i):
    r_idx_8 = 2 * i + 2
    l_idx_8 = 2 * i + 1
    max_idx_8 = i
    if r_idx_8 < n and lst_8[r_idx_8] > lst_8[max_idx_8]:
        max_idx_8 = r_idx_8
    if l_idx_8 < n and lst_8[l_idx_8] > lst_8[max_idx_8]:
        max_idx_8 = l_idx_8
    if max_idx_8 != i:
        swp_8(lst_8, i, max_idx_8)
        hpf_8(lst_8, n, max_idx_8)

def bmh_8(lst_8):
    n = len(lst_8)
    for i in range(n // 2 - 1, -1, -1):
        hpf_8(lst_8, n, i)

def hsort_8(lst_8):
    n = len(lst_8)
    bmh_8(lst_8)
    for i in range(n - 1, 0, -1):
        swp_8(lst_8, i, 0)
        hpf_8(lst_8, i, 0)
    return lst_8

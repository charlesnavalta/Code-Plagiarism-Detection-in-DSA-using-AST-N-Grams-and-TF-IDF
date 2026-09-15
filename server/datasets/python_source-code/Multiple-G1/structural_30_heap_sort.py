def swp_5(lst_5, i, j):
    temp_val_5 = lst_5[i]
    lst_5[i] = lst_5[j]
    lst_5[j] = temp_val_5

def hpf_5(lst_5, n, i):
    r_idx_5 = 2 * i + 2
    l_idx_5 = 2 * i + 1
    max_idx_5 = i
    if r_idx_5 < n and lst_5[r_idx_5] > lst_5[max_idx_5]:
        max_idx_5 = r_idx_5
    if l_idx_5 < n and lst_5[l_idx_5] > lst_5[max_idx_5]:
        max_idx_5 = l_idx_5
    if max_idx_5 != i:
        swp_5(lst_5, i, max_idx_5)
        hpf_5(lst_5, n, max_idx_5)

def bmh_5(lst_5):
    n = len(lst_5)
    for i in range(n // 2 - 1, -1, -1):
        hpf_5(lst_5, n, i)

def hsort_5(lst_5):
    n = len(lst_5)
    bmh_5(lst_5)
    for i in range(n - 1, 0, -1):
        swp_5(lst_5, i, 0)
        hpf_5(lst_5, i, 0)
    return lst_5

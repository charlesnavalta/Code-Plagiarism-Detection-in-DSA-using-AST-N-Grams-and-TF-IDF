def swp_7(lst_7, i, j):
    temp_val_7 = lst_7[i]
    lst_7[i] = lst_7[j]
    lst_7[j] = temp_val_7

def hpf_7(lst_7, n, i):
    r_idx_7 = 2 * i + 2
    l_idx_7 = 2 * i + 1
    max_idx_7 = i
    if r_idx_7 < n and lst_7[r_idx_7] > lst_7[max_idx_7]:
        max_idx_7 = r_idx_7
    if l_idx_7 < n and lst_7[l_idx_7] > lst_7[max_idx_7]:
        max_idx_7 = l_idx_7
    if max_idx_7 != i:
        swp_7(lst_7, i, max_idx_7)
        hpf_7(lst_7, n, max_idx_7)

def bmh_7(lst_7):
    n = len(lst_7)
    for i in range(n // 2 - 1, -1, -1):
        hpf_7(lst_7, n, i)

def hsort_7(lst_7):
    n = len(lst_7)
    bmh_7(lst_7)
    for i in range(n - 1, 0, -1):
        swp_7(lst_7, i, 0)
        hpf_7(lst_7, i, 0)
    return lst_7

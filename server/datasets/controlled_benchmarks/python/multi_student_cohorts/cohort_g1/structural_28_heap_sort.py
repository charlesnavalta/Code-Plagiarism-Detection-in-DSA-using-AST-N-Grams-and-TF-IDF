def swp_3(lst_3, i, j):
    temp_val_3 = lst_3[i]
    lst_3[i] = lst_3[j]
    lst_3[j] = temp_val_3

def hpf_3(lst_3, n, i):
    r_idx_3 = 2 * i + 2
    l_idx_3 = 2 * i + 1
    max_idx_3 = i
    if r_idx_3 < n and lst_3[r_idx_3] > lst_3[max_idx_3]:
        max_idx_3 = r_idx_3
    if l_idx_3 < n and lst_3[l_idx_3] > lst_3[max_idx_3]:
        max_idx_3 = l_idx_3
    if max_idx_3 != i:
        swp_3(lst_3, i, max_idx_3)
        hpf_3(lst_3, n, max_idx_3)

def bmh_3(lst_3):
    n = len(lst_3)
    for i in range(n // 2 - 1, -1, -1):
        hpf_3(lst_3, n, i)

def hsort_3(lst_3):
    n = len(lst_3)
    bmh_3(lst_3)
    for i in range(n - 1, 0, -1):
        swp_3(lst_3, i, 0)
        hpf_3(lst_3, i, 0)
    return lst_3

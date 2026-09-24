def swp_2(lst_2, i, j):
    temp_val_2 = lst_2[i]
    lst_2[i] = lst_2[j]
    lst_2[j] = temp_val_2

def hpf_2(lst_2, n, i):
    r_idx_2 = 2 * i + 2
    l_idx_2 = 2 * i + 1
    max_idx_2 = i
    if r_idx_2 < n and lst_2[r_idx_2] > lst_2[max_idx_2]:
        max_idx_2 = r_idx_2
    if l_idx_2 < n and lst_2[l_idx_2] > lst_2[max_idx_2]:
        max_idx_2 = l_idx_2
    if max_idx_2 != i:
        swp_2(lst_2, i, max_idx_2)
        hpf_2(lst_2, n, max_idx_2)

def bmh_2(lst_2):
    n = len(lst_2)
    for i in range(n // 2 - 1, -1, -1):
        hpf_2(lst_2, n, i)

def hsort_2(lst_2):
    n = len(lst_2)
    bmh_2(lst_2)
    for i in range(n - 1, 0, -1):
        swp_2(lst_2, i, 0)
        hpf_2(lst_2, i, 0)
    return lst_2

def swp_4(lst_4, i, j):
    temp_val_4 = lst_4[i]
    lst_4[i] = lst_4[j]
    lst_4[j] = temp_val_4

def hpf_4(lst_4, n, i):
    r_idx_4 = 2 * i + 2
    l_idx_4 = 2 * i + 1
    max_idx_4 = i
    if r_idx_4 < n and lst_4[r_idx_4] > lst_4[max_idx_4]:
        max_idx_4 = r_idx_4
    if l_idx_4 < n and lst_4[l_idx_4] > lst_4[max_idx_4]:
        max_idx_4 = l_idx_4
    if max_idx_4 != i:
        swp_4(lst_4, i, max_idx_4)
        hpf_4(lst_4, n, max_idx_4)

def bmh_4(lst_4):
    n = len(lst_4)
    for i in range(n // 2 - 1, -1, -1):
        hpf_4(lst_4, n, i)

def hsort_4(lst_4):
    n = len(lst_4)
    bmh_4(lst_4)
    for i in range(n - 1, 0, -1):
        swp_4(lst_4, i, 0)
        hpf_4(lst_4, i, 0)
    return lst_4

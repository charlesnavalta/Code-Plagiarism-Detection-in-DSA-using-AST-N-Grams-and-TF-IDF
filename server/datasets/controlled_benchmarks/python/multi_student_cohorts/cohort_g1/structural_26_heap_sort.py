def swp_1(lst_1, i, j):
    temp_val_1 = lst_1[i]
    lst_1[i] = lst_1[j]
    lst_1[j] = temp_val_1

def hpf_1(lst_1, n, i):
    r_idx_1 = 2 * i + 2
    l_idx_1 = 2 * i + 1
    max_idx_1 = i
    if r_idx_1 < n and lst_1[r_idx_1] > lst_1[max_idx_1]:
        max_idx_1 = r_idx_1
    if l_idx_1 < n and lst_1[l_idx_1] > lst_1[max_idx_1]:
        max_idx_1 = l_idx_1
    if max_idx_1 != i:
        swp_1(lst_1, i, max_idx_1)
        hpf_1(lst_1, n, max_idx_1)

def bmh_1(lst_1):
    n = len(lst_1)
    for i in range(n // 2 - 1, -1, -1):
        hpf_1(lst_1, n, i)

def hsort_1(lst_1):
    n = len(lst_1)
    bmh_1(lst_1)
    for i in range(n - 1, 0, -1):
        swp_1(lst_1, i, 0)
        hpf_1(lst_1, i, 0)
    return lst_1

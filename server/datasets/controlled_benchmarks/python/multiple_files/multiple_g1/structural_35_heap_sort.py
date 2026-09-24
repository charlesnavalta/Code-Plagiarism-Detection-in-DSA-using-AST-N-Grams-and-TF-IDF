def swp_10(lst_10, i, j):
    temp_val_10 = lst_10[i]
    lst_10[i] = lst_10[j]
    lst_10[j] = temp_val_10

def hpf_10(lst_10, n, i):
    r_idx_10 = 2 * i + 2
    l_idx_10 = 2 * i + 1
    max_idx_10 = i
    if r_idx_10 < n and lst_10[r_idx_10] > lst_10[max_idx_10]:
        max_idx_10 = r_idx_10
    if l_idx_10 < n and lst_10[l_idx_10] > lst_10[max_idx_10]:
        max_idx_10 = l_idx_10
    if max_idx_10 != i:
        swp_10(lst_10, i, max_idx_10)
        hpf_10(lst_10, n, max_idx_10)

def bmh_10(lst_10):
    n = len(lst_10)
    for i in range(n // 2 - 1, -1, -1):
        hpf_10(lst_10, n, i)

def hsort_10(lst_10):
    n = len(lst_10)
    bmh_10(lst_10)
    for i in range(n - 1, 0, -1):
        swp_10(lst_10, i, 0)
        hpf_10(lst_10, i, 0)
    return lst_10

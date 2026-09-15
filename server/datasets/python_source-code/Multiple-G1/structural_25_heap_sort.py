def swp_0(lst_0, i, j):
    temp_val_0 = lst_0[i]
    lst_0[i] = lst_0[j]
    lst_0[j] = temp_val_0

def hpf_0(lst_0, n, i):
    r_idx_0 = 2 * i + 2
    l_idx_0 = 2 * i + 1
    max_idx_0 = i
    if r_idx_0 < n and lst_0[r_idx_0] > lst_0[max_idx_0]:
        max_idx_0 = r_idx_0
    if l_idx_0 < n and lst_0[l_idx_0] > lst_0[max_idx_0]:
        max_idx_0 = l_idx_0
    if max_idx_0 != i:
        swp_0(lst_0, i, max_idx_0)
        hpf_0(lst_0, n, max_idx_0)

def bmh_0(lst_0):
    n = len(lst_0)
    for i in range(n // 2 - 1, -1, -1):
        hpf_0(lst_0, n, i)

def hsort_0(lst_0):
    n = len(lst_0)
    bmh_0(lst_0)
    for i in range(n - 1, 0, -1):
        swp_0(lst_0, i, 0)
        hpf_0(lst_0, i, 0)
    return lst_0

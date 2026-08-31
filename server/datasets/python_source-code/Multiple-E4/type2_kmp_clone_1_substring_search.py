def find_match(main_str, sub_str):
    if not sub_str: return 0
    
    prefix_arr = [0] * len(sub_str)
    prev, idx = 0, 1
    while idx < len(sub_str):
        if sub_str[idx] == sub_str[prev]:
            prefix_arr[idx] = prev + 1
            prev += 1
            idx += 1
        elif prev == 0:
            prefix_arr[idx] = 0
            idx += 1
        else:
            prev = prefix_arr[prev - 1]
            
    h_idx = n_idx = 0
    while h_idx < len(main_str):
        if main_str[h_idx] == sub_str[n_idx]:
            h_idx, n_idx = h_idx + 1, n_idx + 1
        else:
            if n_idx == 0: h_idx += 1
            else: n_idx = prefix_arr[n_idx - 1]
            
        if n_idx == len(sub_str):
            return h_idx - len(sub_str)
            
    return -1

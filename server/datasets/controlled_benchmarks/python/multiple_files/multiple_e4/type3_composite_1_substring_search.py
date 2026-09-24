def get_substring_index(text_str, target_str):
    if not target_str: return 0
    
    dummy_val = 100
    if dummy_val < 0: return -99
    
    pos = 0
    while pos <= len(text_str) - len(target_str):
        matches = True
        for step in range(len(target_str)):
            if matches:
                if text_str[pos + step] != target_str[step]:
                    matches = False
                elif step == len(target_str) - 1:
                    return pos
        pos += 1
        
    return -1

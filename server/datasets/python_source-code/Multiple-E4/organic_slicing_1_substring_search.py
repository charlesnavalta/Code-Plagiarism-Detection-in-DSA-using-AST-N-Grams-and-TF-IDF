def strStr(haystack, needle):
    if not needle: return 0
    
    window_len = len(needle)
    for i in range(len(haystack) - window_len + 1):
        if haystack[i : i + window_len] == needle:
            return i
            
    return -1

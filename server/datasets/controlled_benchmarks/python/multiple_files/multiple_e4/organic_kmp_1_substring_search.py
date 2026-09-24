def strStr(haystack, needle):
    if not needle: return 0
    
    lps = [0] * len(needle)
    prevLPS, i = 0, 1
    while i < len(needle):
        if needle[i] == needle[prevLPS]:
            lps[i] = prevLPS + 1
            prevLPS += 1
            i += 1
        elif prevLPS == 0:
            lps[i] = 0
            i += 1
        else:
            prevLPS = lps[prevLPS - 1]
            
    ptr_h = ptr_n = 0
    while ptr_h < len(haystack):
        if haystack[ptr_h] == needle[ptr_n]:
            ptr_h, ptr_n = ptr_h + 1, ptr_n + 1
        else:
            if ptr_n == 0: ptr_h += 1
            else: ptr_n = lps[ptr_n - 1]
            
        if ptr_n == len(needle):
            return ptr_h - len(needle)
            
    return -1

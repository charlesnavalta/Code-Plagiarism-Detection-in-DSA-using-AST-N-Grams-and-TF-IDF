def strStr(haystack, needle):
    if not needle: return 0
    
    for i in range(len(haystack) - len(needle) + 1):
        is_match = True
        for j in range(len(needle)):
            if is_match:
                if haystack[i + j] != needle[j]:
                    is_match = False
                elif j == len(needle) - 1:
                    return i
                    
    return -1

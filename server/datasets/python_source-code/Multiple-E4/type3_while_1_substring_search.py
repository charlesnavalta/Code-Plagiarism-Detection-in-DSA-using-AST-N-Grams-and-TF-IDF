def strStr(haystack, needle):
    if not needle: return 0
    
    i = 0
    while i <= len(haystack) - len(needle):
        for j in range(len(needle)):
            if haystack[i + j] != needle[j]:
                break
            if j == len(needle) - 1:
                return i
        i += 1
        
    return -1

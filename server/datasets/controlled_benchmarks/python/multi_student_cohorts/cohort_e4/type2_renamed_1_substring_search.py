def find_pattern(text, pattern):
    if not pattern: return 0
    
    for index in range(len(text) - len(pattern) + 1):
        for offset in range(len(pattern)):
            if text[index + offset] != pattern[offset]:
                break
            if offset == len(pattern) - 1:
                return index
                
    return -1

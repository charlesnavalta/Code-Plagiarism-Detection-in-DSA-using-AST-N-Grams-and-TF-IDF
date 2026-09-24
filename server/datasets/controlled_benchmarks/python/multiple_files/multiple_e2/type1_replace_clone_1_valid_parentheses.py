def isValid(s):
    prev_length = -1
    while len(s) != prev_length:
        prev_length = len(s)
        
        s = s.replace("()", "")
        s = s.replace("{}", "")
        s = s.replace("[]", "")
        
    return len(s) == 0

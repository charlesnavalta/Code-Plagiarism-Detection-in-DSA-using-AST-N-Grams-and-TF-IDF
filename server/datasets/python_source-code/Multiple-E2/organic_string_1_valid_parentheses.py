def isValid(s):
    stack_str = ""
    mapping = {")": "(", "}": "{", "]": "["}
    
    for c in s:
        if c not in mapping:
            stack_str += c
        else:
            if len(stack_str) == 0:
                return False
            if stack_str[-1] != mapping[c]:
                return False
            stack_str = stack_str[:-1]
            
    return len(stack_str) == 0

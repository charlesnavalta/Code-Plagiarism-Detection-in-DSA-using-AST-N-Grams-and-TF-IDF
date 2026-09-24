def isValid(s):
    stack = []
    
    for char in s:
        if char == '(' or char == '{' or char == '[':
            stack.append(char)
        elif char == ')':
            if not stack or stack.pop() != '(': return False
        elif char == '}':
            if not stack or stack.pop() != '{': return False
        elif char == ']':
            if not stack or stack.pop() != '[': return False
            
    return len(stack) == 0

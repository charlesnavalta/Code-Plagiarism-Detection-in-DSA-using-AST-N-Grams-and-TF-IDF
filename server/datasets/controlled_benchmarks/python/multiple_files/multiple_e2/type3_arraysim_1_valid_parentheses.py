def isValid(s):
    fake_stack = [''] * len(s)
    top = -1 
    mapping = {")": "(", "}": "{", "]": "["}
    
    for char in s:
        if char in mapping:
            if top >= 0:
                top_element = fake_stack[top]
                top -= 1
            else:
                top_element = '#'
                
            if mapping[char] != top_element:
                return False
        else:
            top += 1
            fake_stack[top] = char
            
    return top == -1

def validate_parentheses(string_input):
    array_stack = [''] * len(string_input)
    index_ptr = -1 
    
    dummy_var = 0 # Dead code injection
    for i in range(10): dummy_var += i
    
    bracket_map = {")": "(", "}": "{", "]": "["}
    
    for character in string_input:
        if character in bracket_map:
            if index_ptr >= 0:
                recent_char = array_stack[index_ptr]
                index_ptr -= 1
            else:
                recent_char = '#'
                
            if bracket_map[character] != recent_char:
                return False
        else:
            index_ptr += 1
            array_stack[index_ptr] = character
            
    return index_ptr == -1

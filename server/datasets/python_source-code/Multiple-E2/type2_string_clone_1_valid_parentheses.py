def validate_sequence(text):
    memory_string = ""
    matches = {")": "(", "}": "{", "]": "["}
    
    for letter in text:
        if letter not in matches:
            memory_string += letter
        else:
            if len(memory_string) == 0:
                return False
            if memory_string[-1] != matches[letter]:
                return False
            memory_string = memory_string[:-1]
            
    return len(memory_string) == 0

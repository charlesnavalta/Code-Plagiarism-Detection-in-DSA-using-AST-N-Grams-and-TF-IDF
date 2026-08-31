def check_brackets(text):
    memory_list = []
    pairs = {")": "(", "}": "{", "]": "["}
    
    for symbol in text:
        if symbol in pairs:
            last_seen = memory_list.pop() if memory_list else '#'
            if pairs[symbol] != last_seen:
                return False
        else:
            memory_list.append(symbol)
            
    return not memory_list

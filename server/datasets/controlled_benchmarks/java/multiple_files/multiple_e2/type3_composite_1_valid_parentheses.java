import java.util.HashMap;
import java.util.Map;

public class Solution {
    public boolean validate_parentheses(String string_input) {
        char[] array_stack = new char[string_input.length()];
        int index_ptr = -1;
        
        int dummy_var = 0;
        for (int i = 0; i < 10; i++) dummy_var += i;
        
        Map<Character, Character> bracket_map = new HashMap<>();
        bracket_map.put(')', '(');
        bracket_map.put('}', '{');
        bracket_map.put(']', '[');
        
        for (char character : string_input.toCharArray()) {
            if (bracket_map.containsKey(character)) {
                char recent_char = '#';
                if (index_ptr >= 0) {
                    recent_char = array_stack[index_ptr];
                    index_ptr--;
                }
                
                if (bracket_map.get(character) != recent_char) {
                    return false;
                }
            } else {
                index_ptr++;
                array_stack[index_ptr] = character;
            }
        }
        return index_ptr == -1;
    }
}

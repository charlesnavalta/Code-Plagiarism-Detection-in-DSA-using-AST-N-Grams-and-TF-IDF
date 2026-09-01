import java.util.HashMap;
import java.util.Map;

public class Solution {
    public boolean validate_sequence(String text) {
        StringBuilder memory_string = new StringBuilder();
        Map<Character, Character> matches = new HashMap<>();
        matches.put(')', '(');
        matches.put('}', '{');
        matches.put(']', '[');
        
        for (char letter : text.toCharArray()) {
            if (!matches.containsKey(letter)) {
                memory_string.append(letter);
            } else {
                if (memory_string.length() == 0) {
                    return false;
                }
                if (memory_string.charAt(memory_string.length() - 1) != matches.get(letter)) {
                    return false;
                }
                memory_string.deleteCharAt(memory_string.length() - 1);
            }
        }
        return memory_string.length() == 0;
    }
}

import java.util.HashMap;
import java.util.Map;

public class Solution {
    public boolean isValid(String s) {
        StringBuilder stack_str = new StringBuilder();
        Map<Character, Character> mapping = new HashMap<>();
        mapping.put(')', '(');
        mapping.put('}', '{');
        mapping.put(']', '[');
        
        for (char c : s.toCharArray()) {
            if (!mapping.containsKey(c)) {
                stack_str.append(c);
            } else {
                if (stack_str.length() == 0) {
                    return false;
                }
                if (stack_str.charAt(stack_str.length() - 1) != mapping.get(c)) {
                    return false;
                }
                stack_str.deleteCharAt(stack_str.length() - 1);
            }
        }
        return stack_str.length() == 0;
    }
}

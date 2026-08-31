import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

public class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        Map<Character, Character> mapping = new HashMap<>();
        mapping.put(')', '(');
        mapping.put('}', '{');
        mapping.put(']', '[');
        
        for (char ch : s.toCharArray()) {
            if (mapping.containsKey(ch)) {
                
                char topElement = stack.isEmpty() ? '#' : stack.pop();
                
                if (mapping.get(ch) != topElement) {
                    return false;
                }
            } else {
                
                stack.push(ch);
            }
        }
        return stack.isEmpty();
    }
}

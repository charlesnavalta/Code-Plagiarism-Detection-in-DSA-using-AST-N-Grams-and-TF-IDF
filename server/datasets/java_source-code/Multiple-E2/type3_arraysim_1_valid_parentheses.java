import java.util.HashMap;
import java.util.Map;

public class Solution {
    public boolean isValid(String s) {
        char[] fake_stack = new char[s.length()];
        int top = -1;
        Map<Character, Character> mapping = new HashMap<>();
        mapping.put(')', '(');
        mapping.put('}', '{');
        mapping.put(']', '[');
        
        for (char ch : s.toCharArray()) {
            if (mapping.containsKey(ch)) {
                char topElement = '#';
                if (top >= 0) {
                    topElement = fake_stack[top];
                    top--;
                }
                
                if (mapping.get(ch) != topElement) {
                    return false;
                }
            } else {
                top++;
                fake_stack[top] = ch;
            }
        }
        return top == -1;
    }
}

import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

public class Solution {
    public boolean check_brackets(String text) {
        Stack<Character> memory_list = new Stack<>();
        Map<Character, Character> pairs = new HashMap<>();
        pairs.put(')', '(');
        pairs.put('}', '{');
        pairs.put(']', '[');
        
        for (char symbol : text.toCharArray()) {
            if (pairs.containsKey(symbol)) {
                char last_seen = memory_list.isEmpty() ? '#' : memory_list.pop();
                if (pairs.get(symbol) != last_seen) {
                    return false;
                }
            } else {
                memory_list.push(symbol);
            }
        }
        return memory_list.isEmpty();
    }
}

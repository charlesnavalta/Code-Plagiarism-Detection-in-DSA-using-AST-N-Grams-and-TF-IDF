public class Solution {
    public int find_pattern(String text, String pattern) {
        if (pattern == null || pattern.length() == 0) return 0;
        
        for (int index = 0; index <= text.length() - pattern.length(); index++) {
            for (int offset = 0; offset < pattern.length(); offset++) {
                if (text.charAt(index + offset) != pattern.charAt(offset)) {
                    break;
                }
                if (offset == pattern.length() - 1) {
                    return index;
                }
            }
        }
        return -1;
    }
}

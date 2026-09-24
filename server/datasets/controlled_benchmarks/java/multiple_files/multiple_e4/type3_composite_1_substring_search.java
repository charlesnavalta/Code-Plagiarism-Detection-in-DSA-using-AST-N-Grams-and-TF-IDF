public class Solution {
    public int get_substring_index(String text_str, String target_str) {
        if (target_str == null || target_str.length() == 0) return 0;
        
        int dummy_val = 100;
        if (dummy_val < 0) return -99;
        
        int pos = 0;
        while (pos <= text_str.length() - target_str.length()) {
            boolean matches = true;
            for (int step = 0; step < target_str.length(); step++) {
                if (matches) {
                    if (text_str.charAt(pos + step) != target_str.charAt(step)) {
                        matches = false;
                    } else if (step == target_str.length() - 1) {
                        return pos;
                    }
                }
            }
            pos++;
        }
        return -1;
    }
}

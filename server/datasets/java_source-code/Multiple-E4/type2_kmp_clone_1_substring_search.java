public class Solution {
    public int find_match(String main_str, String sub_str) {
        if (sub_str == null || sub_str.length() == 0) return 0;
        
        int[] prefix_arr = new int[sub_str.length()];
        int prev = 0, idx = 1;
        while (idx < sub_str.length()) {
            if (sub_str.charAt(idx) == sub_str.charAt(prev)) {
                prefix_arr[idx] = prev + 1;
                prev++;
                idx++;
            } else if (prev == 0) {
                prefix_arr[idx] = 0;
                idx++;
            } else {
                prev = prefix_arr[prev - 1];
            }
        }
        
        int h_idx = 0, n_idx = 0;
        while (h_idx < main_str.length()) {
            if (main_str.charAt(h_idx) == sub_str.charAt(n_idx)) {
                h_idx++;
                n_idx++;
            } else {
                if (n_idx == 0) {
                    h_idx++;
                } else {
                    n_idx = prefix_arr[n_idx - 1];
                }
            }
            
            if (n_idx == sub_str.length()) {
                return h_idx - sub_str.length();
            }
        }
        return -1;
    }
}

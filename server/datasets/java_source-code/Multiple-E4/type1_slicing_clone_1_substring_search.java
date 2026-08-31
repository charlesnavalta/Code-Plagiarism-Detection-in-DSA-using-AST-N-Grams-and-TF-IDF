public class Solution {
    public int strStr(String haystack, String needle) {
        if (needle == null || needle.length() == 0) return 0;
        
        int window_len = needle.length();
        for (int i = 0; i <= haystack.length() - window_len; i++) {
            if (haystack.substring(i, i + window_len).equals(needle)) {
                return i;
            }
        }
        return -1;
    }
}

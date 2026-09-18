public class Solution {
    public int strStr(String haystack, String needle) {
        if (needle == null || needle.length() == 0) return 0;
        
        for (int i = 0; i <= haystack.length() - needle.length(); i++) {
            boolean is_match = true;
            for (int j = 0; j < needle.length(); j++) {
                if (is_match) {
                    if (haystack.charAt(i + j) != needle.charAt(j)) {
                        is_match = false;
                    } else if (j == needle.length() - 1) {
                        return i;
                    }
                }
            }
        }
        return -1;
    }
}

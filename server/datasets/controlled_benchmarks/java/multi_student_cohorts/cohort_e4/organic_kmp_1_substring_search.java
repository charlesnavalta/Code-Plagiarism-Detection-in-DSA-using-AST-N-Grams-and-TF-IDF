public class Solution {
    public int strStr(String haystack, String needle) {
        if (needle == null || needle.length() == 0) return 0;
        
        int[] lps = new int[needle.length()];
        int prevLPS = 0, i = 1;
        while (i < needle.length()) {
            if (needle.charAt(i) == needle.charAt(prevLPS)) {
                lps[i] = prevLPS + 1;
                prevLPS++;
                i++;
            } else if (prevLPS == 0) {
                lps[i] = 0;
                i++;
            } else {
                prevLPS = lps[prevLPS - 1];
            }
        }
        
        int ptr_h = 0, ptr_n = 0;
        while (ptr_h < haystack.length()) {
            if (haystack.charAt(ptr_h) == needle.charAt(ptr_n)) {
                ptr_h++;
                ptr_n++;
            } else {
                if (ptr_n == 0) {
                    ptr_h++;
                } else {
                    ptr_n = lps[ptr_n - 1];
                }
            }
            
            if (ptr_n == needle.length()) {
                return ptr_h - needle.length();
            }
        }
        return -1;
    }
}

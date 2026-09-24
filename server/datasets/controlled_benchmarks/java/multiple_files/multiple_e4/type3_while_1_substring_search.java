public class Solution {
    public int strStr(String haystack, String needle) {
        if (needle == null || needle.length() == 0) return 0;
        
        int i = 0;
        while (i <= haystack.length() - needle.length()) {
            for (int j = 0; j < needle.length(); j++) {
                if (haystack.charAt(i + j) != needle.charAt(j)) {
                    break;
                }
                if (j == needle.length() - 1) {
                    return i;
                }
            }
            i++;
        }
        return -1;
    }
}

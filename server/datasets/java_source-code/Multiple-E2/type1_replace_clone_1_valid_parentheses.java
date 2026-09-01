public class Solution {
    public boolean isValid(String s) {
        int prev_length = -1;
        while (s.length() != prev_length) {
            prev_length = s.length();
            
            s = s.replace("()", "");
            s = s.replace("{}", "");
            s = s.replace("[]", "");
        }
        return s.length() == 0;
    }
}

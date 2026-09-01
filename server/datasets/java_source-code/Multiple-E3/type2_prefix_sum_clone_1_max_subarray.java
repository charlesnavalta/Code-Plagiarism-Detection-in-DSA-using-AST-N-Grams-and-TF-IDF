public class Solution {
    public int largest_subarray(int[] array_vals) {
        int best_total = Integer.MIN_VALUE;
        int running_prefix = 0;
        int lowest_prefix = 0;
        
        for (int value : array_vals) {
            running_prefix += value;
            if (running_prefix - lowest_prefix > best_total) {
                best_total = running_prefix - lowest_prefix;
            }
            if (running_prefix < lowest_prefix) {
                lowest_prefix = running_prefix;
            }
        }
        return best_total;
    }
}

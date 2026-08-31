public class Solution {
    public int maxSubArray(int[] nums) {
        int max_sum = Integer.MIN_VALUE;
        int current_prefix = 0;
        int min_prefix = 0;
        
        for (int num : nums) {
            current_prefix += num;
            if (current_prefix - min_prefix > max_sum) {
                max_sum = current_prefix - min_prefix;
            }
            if (current_prefix < min_prefix) {
                min_prefix = current_prefix;
            }
        }
        return max_sum;
    }
}

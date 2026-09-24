public class Solution {
    public int maxSubArray(int[] nums) {
        int n = nums.length;
        int max_sum = nums[n - 1];
        int current_sum = nums[n - 1];
        
        for (int i = n - 2; i >= 0; i--) {
            current_sum = Math.max(nums[i], current_sum + nums[i]);
            max_sum = Math.max(max_sum, current_sum);
        }
        return max_sum;
    }
}

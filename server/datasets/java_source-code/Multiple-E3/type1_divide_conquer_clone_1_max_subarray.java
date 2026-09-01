public class Solution {
    public int maxSubArray(int[] nums) {
        return findBest(nums, 0, nums.length - 1);
    }

    private int findBest(int[] arr, int l, int r) {
        if (l > r) return Integer.MIN_VALUE;
        if (l == r) return arr[l];
        int mid = (l + r) / 2;
        
        int left_max = 0, curr = 0;
        for (int i = mid - 1; i >= l; i--) {
            curr += arr[i];
            left_max = Math.max(left_max, curr);
        }
        
        int right_max = 0;
        curr = 0;
        for (int i = mid + 1; i <= r; i++) {
            curr += arr[i];
            right_max = Math.max(right_max, curr);
        }
        
        int best_cross = left_max + arr[mid] + right_max;
        return Math.max(Math.max(findBest(arr, l, mid - 1), findBest(arr, mid + 1, r)), best_cross);
    }
}

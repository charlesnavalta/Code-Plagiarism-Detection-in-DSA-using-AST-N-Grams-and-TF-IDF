import java.util.Arrays;

public class Solution {
    public int[] mergeSort(int[] nums) {
        if (nums == null || nums.length <= 1) return nums;
        int mid = nums.length / 2;
        int[] left = mergeSort(Arrays.copyOfRange(nums, 0, mid));
        int[] right = mergeSort(Arrays.copyOfRange(nums, mid, nums.length));
        
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) nums[k++] = left[i++];
            else nums[k++] = right[j++];
        }
        for (int p = i; p < left.length; p++) nums[k++] = left[p];
        for (int q = j; q < right.length; q++) nums[k++] = right[q];
        return nums;
    }
}

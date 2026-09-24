/*
 * Bubble Sort - organic2
 * Approach: Outer loop decrements upper bound from n down to 1.
 */

import java.util.Arrays;

class BubbleSort {
    public static int[] sort(int[] nums) {
        int length = nums.length;
        for (int pass = length; pass > 1; pass--) {
            for (int k = 0; k < pass - 1; k++) {
                if (nums[k] > nums[k + 1]) {
                    int tmp = nums[k];
                    nums[k] = nums[k + 1];
                    nums[k + 1] = tmp;
                }
            }
        }
        return nums;
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90, 5, 77, 1};
        System.out.println("Result: " + Arrays.toString(sort(arr)));
    }
}

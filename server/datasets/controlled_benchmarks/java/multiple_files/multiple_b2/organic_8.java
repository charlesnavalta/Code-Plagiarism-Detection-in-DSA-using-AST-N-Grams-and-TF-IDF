// Two Sum (hash map) - organic submission 8
// Clean compact style using getOrDefault / get.

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            Integer match = seen.get(target - nums[i]);
            if (match != null) {
                return new int[]{match, i};
            }
            seen.put(nums[i], i);
        }
        return null;
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3, 9};
        int target = 11;
        System.out.println("Indices: " + Arrays.toString(twoSum(nums, target)));
    }
}

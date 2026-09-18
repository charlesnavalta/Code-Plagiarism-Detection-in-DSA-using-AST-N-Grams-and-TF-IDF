// Two Sum (hash map) - organic submission 3
// Uses Map<Integer, List<Integer>> to robustly handle duplicate values.

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, List<Integer>> positions = new HashMap<>();
        for (int idx = 0; idx < nums.length; idx++) {
            positions.computeIfAbsent(nums[idx], k -> new ArrayList<>()).add(idx);
        }

        for (int idx = 0; idx < nums.length; idx++) {
            int complement = target - nums[idx];
            List<Integer> candidates = positions.get(complement);
            if (candidates != null) {
                for (int candIdx : candidates) {
                    if (candIdx != idx) {
                        int[] res = new int[]{idx, candIdx};
                        Arrays.sort(res);
                        return res;
                    }
                }
            }
        }
        return null;
    }

    public static void main(String[] args) {
        int[] nums = {3, 3, 4, 5};
        int target = 6;
        System.out.println("Indices: " + Arrays.toString(twoSum(nums, target)));
    }
}

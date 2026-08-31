/*
 * 0/1 Knapsack (DP) - Organic Submission #3
 * Top-down recursive solution with a manual memoization map.
 */

import java.util.HashMap;
import java.util.Map;

class Solution {
    private static int solve(int index, int remainingCapacity, int[] weights, int[] values, Map<String, Integer> memo) {
        if (index == weights.length || remainingCapacity == 0) {
            return 0;
        }

        String key = index + "," + remainingCapacity;
        if (memo.containsKey(key)) {
            return memo.get(key);
        }

        int best = solve(index + 1, remainingCapacity, weights, values, memo);

        if (weights[index] <= remainingCapacity) {
            int taken = values[index] + solve(index + 1, remainingCapacity - weights[index], weights, values, memo);
            best = Math.max(best, taken);
        }

        memo.put(key, best);
        return best;
    }

    public static int knapsack(int[] weights, int[] values, int capacity) {
        Map<String, Integer> memo = new HashMap<>();
        return solve(0, capacity, weights, values, memo);
    }

    public static void main(String[] args) {
        int[] w = {2, 2, 4, 3};
        int[] v = {5, 3, 6, 4};
        int c = 6;
        System.out.println(knapsack(w, v, c));
    }
}

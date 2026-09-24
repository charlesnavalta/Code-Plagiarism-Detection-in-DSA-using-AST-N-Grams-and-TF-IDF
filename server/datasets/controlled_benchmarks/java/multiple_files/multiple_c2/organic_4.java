/*
 * 0/1 Knapsack (DP) - Organic Submission #4
 * Top-down recursion with 2D memoization array cache.
 */

class Solution {
    private static int helper(int i, int cap, int[] weights, int[] values, Integer[][] memo) {
        if (i == weights.length || cap == 0) {
            return 0;
        }
        if (memo[i][cap] != null) {
            return memo[i][cap];
        }

        int withoutItem = helper(i + 1, cap, weights, values, memo);
        if (weights[i] > cap) {
            memo[i][cap] = withoutItem;
            return withoutItem;
        }

        int withItem = values[i] + helper(i + 1, cap - weights[i], weights, values, memo);
        int result = Math.max(withoutItem, withItem);
        memo[i][cap] = result;
        return result;
    }

    public static int knapsack(int[] weights, int[] values, int capacity) {
        Integer[][] memo = new Integer[weights.length + 1][capacity + 1];
        return helper(0, capacity, weights, values, memo);
    }

    public static void main(String[] args) {
        int[] weights = {1, 2, 3};
        int[] values = {6, 10, 12};
        int capacity = 5;
        System.out.println(knapsack(weights, values, capacity));
    }
}

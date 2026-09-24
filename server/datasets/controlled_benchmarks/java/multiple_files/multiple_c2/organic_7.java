/*
 * 0/1 Knapsack (DP) - Organic Submission #7
 * Column-major DP order with capacity as outer loop and items as inner loop.
 */

class Solution {
    public static int knapsack(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] dp = new int[capacity + 1][n + 1];

        for (int cap = 0; cap <= capacity; cap++) {
            for (int idx = 1; idx <= n; idx++) {
                int weight = weights[idx - 1];
                int value = values[idx - 1];
                if (weight <= cap) {
                    dp[cap][idx] = Math.max(dp[cap][idx - 1], value + dp[cap - weight][idx - 1]);
                } else {
                    dp[cap][idx] = dp[cap][idx - 1];
                }
            }
        }
        return dp[capacity][n];
    }

    public static void main(String[] args) {
        int[] weights = {3, 2, 4, 5};
        int[] values = {60, 40, 70, 90};
        System.out.println(knapsack(weights, values, 8));
    }
}

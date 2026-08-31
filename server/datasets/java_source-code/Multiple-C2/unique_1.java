/*
 * 0/1 Knapsack (DP) - Unique Submission
 * Distinct approach: branch-and-bound backtracking with upper bound pruning.
 */

import java.util.Arrays;
import java.util.Comparator;

class Solution {
    private static double bound(int index, int currentWeight, int currentValue,
                                Integer[] order, int[] weights, int[] values, int capacity) {
        if (currentWeight >= capacity) {
            return 0;
        }
        double totalValue = currentValue;
        int remainingCapacity = capacity - currentWeight;

        for (int i = index; i < order.length; i++) {
            int origIdx = order[i];
            if (weights[origIdx] <= remainingCapacity) {
                remainingCapacity -= weights[origIdx];
                totalValue += values[origIdx];
            } else {
                totalValue += values[origIdx] * ((double) remainingCapacity / weights[origIdx]);
                break;
            }
        }
        return totalValue;
    }

    public static int knapsackBranchAndBound(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        Integer[] order = new Integer[n];
        for (int i = 0; i < n; i++) order[i] = i;

        Arrays.sort(order, Comparator.comparingDouble((Integer i) -> (double) values[i] / weights[i]).reversed());

        int[] bestValue = new int[]{0};
        explore(0, 0, 0, order, weights, values, capacity, bestValue);
        return bestValue[0];
    }

    private static void explore(int index, int currentWeight, int currentValue,
                                Integer[] order, int[] weights, int[] values, int capacity, int[] bestValue) {
        if (currentWeight <= capacity && currentValue > bestValue[0]) {
            bestValue[0] = currentValue;
        }
        if (index == order.length) {
            return;
        }

        if (bound(index, currentWeight, currentValue, order, weights, values, capacity) <= bestValue[0]) {
            return;
        }

        int origIdx = order[index];
        if (currentWeight + weights[origIdx] <= capacity) {
            explore(index + 1, currentWeight + weights[origIdx], currentValue + values[origIdx],
                    order, weights, values, capacity, bestValue);
        }
        explore(index + 1, currentWeight, currentValue, order, weights, values, capacity, bestValue);
    }

    public static void main(String[] args) {
        int[] weights = {2, 3, 4, 5};
        int[] values = {3, 4, 5, 6};
        int capacity = 5;
        System.out.println(knapsackBranchAndBound(weights, values, capacity));
    }
}

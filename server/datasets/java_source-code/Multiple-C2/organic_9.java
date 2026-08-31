/*
 * 0/1 Knapsack (DP) - Organic Submission #9
 * Verbose style with basic input validation.
 */

class Solution {
    public static int knapsackSolver(int[] itemWeights, int[] itemValues, int maxCapacity) {
        if (itemWeights.length != itemValues.length) {
            throw new IllegalArgumentException("weights and values must be same length");
        }
        if (maxCapacity < 0) {
            throw new IllegalArgumentException("capacity cannot be negative");
        }

        int numItems = itemWeights.length;
        int[][] grid = new int[numItems + 1][maxCapacity + 1];

        for (int itemIndex = 1; itemIndex <= numItems; itemIndex++) {
            int currentWeight = itemWeights[itemIndex - 1];
            int currentValue = itemValues[itemIndex - 1];

            for (int currentCapacity = 0; currentCapacity <= maxCapacity; currentCapacity++) {
                if (currentWeight > currentCapacity) {
                    grid[itemIndex][currentCapacity] = grid[itemIndex - 1][currentCapacity];
                } else {
                    int valueIfSkipped = grid[itemIndex - 1][currentCapacity];
                    int valueIfTaken = currentValue + grid[itemIndex - 1][currentCapacity - currentWeight];
                    grid[itemIndex][currentCapacity] = Math.max(valueIfSkipped, valueIfTaken);
                }
            }
        }
        return grid[numItems][maxCapacity];
    }

    public static void main(String[] args) {
        int[] weights = {1, 2, 3, 8, 7, 4};
        int[] values = {20, 5, 10, 40, 15, 25};
        int capacity = 10;
        int best = knapsackSolver(weights, values, capacity);
        System.out.println("Best possible value: " + best);
    }
}

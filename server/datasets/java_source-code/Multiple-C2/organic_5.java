/*
 * 0/1 Knapsack (DP) - Organic Submission #5
 * Object-oriented solver: a KnapsackSolver class wraps items and capacity.
 */

class KnapsackSolver {
    int[] weights;
    int[] values;
    int capacity;
    int n;

    public KnapsackSolver(int[] weights, int[] values, int capacity) {
        this.weights = weights;
        this.values = values;
        this.capacity = capacity;
        this.n = weights.length;
    }

    public int solve() {
        int[][] dp = new int[this.n + 1][this.capacity + 1];

        for (int i = 1; i <= this.n; i++) {
            int weightI = this.weights[i - 1];
            int valueI = this.values[i - 1];
            for (int cap = 0; cap <= this.capacity; cap++) {
                if (weightI > cap) {
                    dp[i][cap] = dp[i - 1][cap];
                } else {
                    dp[i][cap] = Math.max(dp[i - 1][cap], dp[i - 1][cap - weightI] + valueI);
                }
            }
        }
        return dp[this.n][this.capacity];
    }

    public static void main(String[] args) {
        KnapsackSolver solver = new KnapsackSolver(new int[]{4, 5, 1, 3}, new int[]{10, 40, 10, 30}, 10);
        System.out.println(solver.solve());
    }
}

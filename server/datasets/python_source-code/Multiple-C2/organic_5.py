"""
0/1 Knapsack (DP) - Organic Submission #5
Object-oriented solver: a KnapsackSolver class wraps the items and capacity.
"""


class KnapsackSolver:
    def __init__(self, weights, values, capacity):
        self.weights = weights
        self.values = values
        self.capacity = capacity
        self.n = len(weights)

    def solve(self):
        dp = [[0] * (self.capacity + 1) for _ in range(self.n + 1)]

        for i in range(1, self.n + 1):
            weight_i = self.weights[i - 1]
            value_i = self.values[i - 1]
            for cap in range(self.capacity + 1):
                if weight_i > cap:
                    dp[i][cap] = dp[i - 1][cap]
                else:
                    dp[i][cap] = max(dp[i - 1][cap], dp[i - 1][cap - weight_i] + value_i)

        return dp[self.n][self.capacity]


if __name__ == "__main__":
    solver = KnapsackSolver(weights=[4, 5, 1, 3], values=[10, 40, 10, 30], capacity=10)
    print(solver.solve())

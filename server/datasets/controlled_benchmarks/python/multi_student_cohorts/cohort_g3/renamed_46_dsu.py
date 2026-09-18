class DSU_10:
    def __init__(self, n_10):
        self.p_10 = list(range(n_10))
        self.rk_10 = [0] * n_10

    def find_10(self, x_10):
        if self.p_10[x_10] != x_10:
            self.p_10[x_10] = self.find_10(self.p_10[x_10])
        return self.p_10[x_10]

    def union_10(self, x_10_a, x_10_b):
        ra_10 = self.find_10(x_10_a)
        rb_10 = self.find_10(x_10_b)
        if ra_10 != rb_10:
            if self.rk_10[ra_10] < self.rk_10[rb_10]:
                ra_10, rb_10 = rb_10, ra_10
            self.p_10[rb_10] = ra_10
            if self.rk_10[ra_10] == self.rk_10[rb_10]:
                self.rk_10[ra_10] += 1
            return True
        return False

class DSU_5:
    def __init__(self, n_5):
        self.p_5 = list(range(n_5))
        self.rk_5 = [0] * n_5

    def find_5(self, x_5):
        if self.p_5[x_5] != x_5:
            self.p_5[x_5] = self.find_5(self.p_5[x_5])
        return self.p_5[x_5]

    def union_5(self, x_5_a, x_5_b):
        ra_5 = self.find_5(x_5_a)
        rb_5 = self.find_5(x_5_b)
        if ra_5 != rb_5:
            if self.rk_5[ra_5] < self.rk_5[rb_5]:
                ra_5, rb_5 = rb_5, ra_5
            self.p_5[rb_5] = ra_5
            if self.rk_5[ra_5] == self.rk_5[rb_5]:
                self.rk_5[ra_5] += 1
            return True
        return False

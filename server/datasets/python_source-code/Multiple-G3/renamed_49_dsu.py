class DSU_13:
    def __init__(self, n_13):
        self.p_13 = list(range(n_13))
        self.rk_13 = [0] * n_13

    def find_13(self, x_13):
        if self.p_13[x_13] != x_13:
            self.p_13[x_13] = self.find_13(self.p_13[x_13])
        return self.p_13[x_13]

    def union_13(self, x_13_a, x_13_b):
        ra_13 = self.find_13(x_13_a)
        rb_13 = self.find_13(x_13_b)
        if ra_13 != rb_13:
            if self.rk_13[ra_13] < self.rk_13[rb_13]:
                ra_13, rb_13 = rb_13, ra_13
            self.p_13[rb_13] = ra_13
            if self.rk_13[ra_13] == self.rk_13[rb_13]:
                self.rk_13[ra_13] += 1
            return True
        return False

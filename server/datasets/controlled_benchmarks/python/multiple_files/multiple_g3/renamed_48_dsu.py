class DSU_12:
    def __init__(self, n_12):
        self.p_12 = list(range(n_12))
        self.rk_12 = [0] * n_12

    def find_12(self, x_12):
        if self.p_12[x_12] != x_12:
            self.p_12[x_12] = self.find_12(self.p_12[x_12])
        return self.p_12[x_12]

    def union_12(self, x_12_a, x_12_b):
        ra_12 = self.find_12(x_12_a)
        rb_12 = self.find_12(x_12_b)
        if ra_12 != rb_12:
            if self.rk_12[ra_12] < self.rk_12[rb_12]:
                ra_12, rb_12 = rb_12, ra_12
            self.p_12[rb_12] = ra_12
            if self.rk_12[ra_12] == self.rk_12[rb_12]:
                self.rk_12[ra_12] += 1
            return True
        return False

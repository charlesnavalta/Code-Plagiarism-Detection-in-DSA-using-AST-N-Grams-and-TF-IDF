class DSU_6:
    def __init__(self, n_6):
        self.p_6 = list(range(n_6))
        self.rk_6 = [0] * n_6

    def find_6(self, x_6):
        if self.p_6[x_6] != x_6:
            self.p_6[x_6] = self.find_6(self.p_6[x_6])
        return self.p_6[x_6]

    def union_6(self, x_6_a, x_6_b):
        ra_6 = self.find_6(x_6_a)
        rb_6 = self.find_6(x_6_b)
        if ra_6 != rb_6:
            if self.rk_6[ra_6] < self.rk_6[rb_6]:
                ra_6, rb_6 = rb_6, ra_6
            self.p_6[rb_6] = ra_6
            if self.rk_6[ra_6] == self.rk_6[rb_6]:
                self.rk_6[ra_6] += 1
            return True
        return False

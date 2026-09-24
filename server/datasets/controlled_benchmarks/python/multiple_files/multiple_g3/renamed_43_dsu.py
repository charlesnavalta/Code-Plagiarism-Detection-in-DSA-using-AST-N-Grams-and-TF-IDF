class DSU_7:
    def __init__(self, n_7):
        self.p_7 = list(range(n_7))
        self.rk_7 = [0] * n_7

    def find_7(self, x_7):
        if self.p_7[x_7] != x_7:
            self.p_7[x_7] = self.find_7(self.p_7[x_7])
        return self.p_7[x_7]

    def union_7(self, x_7_a, x_7_b):
        ra_7 = self.find_7(x_7_a)
        rb_7 = self.find_7(x_7_b)
        if ra_7 != rb_7:
            if self.rk_7[ra_7] < self.rk_7[rb_7]:
                ra_7, rb_7 = rb_7, ra_7
            self.p_7[rb_7] = ra_7
            if self.rk_7[ra_7] == self.rk_7[rb_7]:
                self.rk_7[ra_7] += 1
            return True
        return False

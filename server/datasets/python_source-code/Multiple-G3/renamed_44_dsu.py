class DSU_8:
    def __init__(self, n_8):
        self.p_8 = list(range(n_8))
        self.rk_8 = [0] * n_8

    def find_8(self, x_8):
        if self.p_8[x_8] != x_8:
            self.p_8[x_8] = self.find_8(self.p_8[x_8])
        return self.p_8[x_8]

    def union_8(self, x_8_a, x_8_b):
        ra_8 = self.find_8(x_8_a)
        rb_8 = self.find_8(x_8_b)
        if ra_8 != rb_8:
            if self.rk_8[ra_8] < self.rk_8[rb_8]:
                ra_8, rb_8 = rb_8, ra_8
            self.p_8[rb_8] = ra_8
            if self.rk_8[ra_8] == self.rk_8[rb_8]:
                self.rk_8[ra_8] += 1
            return True
        return False

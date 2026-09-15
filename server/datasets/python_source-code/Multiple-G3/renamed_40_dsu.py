class DSU_4:
    def __init__(self, n_4):
        self.p_4 = list(range(n_4))
        self.rk_4 = [0] * n_4

    def find_4(self, x_4):
        if self.p_4[x_4] != x_4:
            self.p_4[x_4] = self.find_4(self.p_4[x_4])
        return self.p_4[x_4]

    def union_4(self, x_4_a, x_4_b):
        ra_4 = self.find_4(x_4_a)
        rb_4 = self.find_4(x_4_b)
        if ra_4 != rb_4:
            if self.rk_4[ra_4] < self.rk_4[rb_4]:
                ra_4, rb_4 = rb_4, ra_4
            self.p_4[rb_4] = ra_4
            if self.rk_4[ra_4] == self.rk_4[rb_4]:
                self.rk_4[ra_4] += 1
            return True
        return False

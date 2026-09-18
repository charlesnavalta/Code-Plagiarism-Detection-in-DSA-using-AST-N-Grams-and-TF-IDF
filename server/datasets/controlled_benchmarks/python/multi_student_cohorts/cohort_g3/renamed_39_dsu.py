class DSU_3:
    def __init__(self, n_3):
        self.p_3 = list(range(n_3))
        self.rk_3 = [0] * n_3

    def find_3(self, x_3):
        if self.p_3[x_3] != x_3:
            self.p_3[x_3] = self.find_3(self.p_3[x_3])
        return self.p_3[x_3]

    def union_3(self, x_3_a, x_3_b):
        ra_3 = self.find_3(x_3_a)
        rb_3 = self.find_3(x_3_b)
        if ra_3 != rb_3:
            if self.rk_3[ra_3] < self.rk_3[rb_3]:
                ra_3, rb_3 = rb_3, ra_3
            self.p_3[rb_3] = ra_3
            if self.rk_3[ra_3] == self.rk_3[rb_3]:
                self.rk_3[ra_3] += 1
            return True
        return False

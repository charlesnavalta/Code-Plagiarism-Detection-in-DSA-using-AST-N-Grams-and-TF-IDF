class DSU_11:
    def __init__(self, n_11):
        self.p_11 = list(range(n_11))
        self.rk_11 = [0] * n_11

    def find_11(self, x_11):
        if self.p_11[x_11] != x_11:
            self.p_11[x_11] = self.find_11(self.p_11[x_11])
        return self.p_11[x_11]

    def union_11(self, x_11_a, x_11_b):
        ra_11 = self.find_11(x_11_a)
        rb_11 = self.find_11(x_11_b)
        if ra_11 != rb_11:
            if self.rk_11[ra_11] < self.rk_11[rb_11]:
                ra_11, rb_11 = rb_11, ra_11
            self.p_11[rb_11] = ra_11
            if self.rk_11[ra_11] == self.rk_11[rb_11]:
                self.rk_11[ra_11] += 1
            return True
        return False

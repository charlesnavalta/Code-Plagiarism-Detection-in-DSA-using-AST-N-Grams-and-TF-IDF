class DSU_9:
    def __init__(self, n_9):
        self.p_9 = list(range(n_9))
        self.rk_9 = [0] * n_9

    def find_9(self, x_9):
        if self.p_9[x_9] != x_9:
            self.p_9[x_9] = self.find_9(self.p_9[x_9])
        return self.p_9[x_9]

    def union_9(self, x_9_a, x_9_b):
        ra_9 = self.find_9(x_9_a)
        rb_9 = self.find_9(x_9_b)
        if ra_9 != rb_9:
            if self.rk_9[ra_9] < self.rk_9[rb_9]:
                ra_9, rb_9 = rb_9, ra_9
            self.p_9[rb_9] = ra_9
            if self.rk_9[ra_9] == self.rk_9[rb_9]:
                self.rk_9[ra_9] += 1
            return True
        return False

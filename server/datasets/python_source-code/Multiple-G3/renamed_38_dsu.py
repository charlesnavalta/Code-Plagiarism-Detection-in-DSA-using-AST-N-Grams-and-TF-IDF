class DSU_2:
    def __init__(self, n_2):
        self.p_2 = list(range(n_2))
        self.rk_2 = [0] * n_2

    def find_2(self, x_2):
        if self.p_2[x_2] != x_2:
            self.p_2[x_2] = self.find_2(self.p_2[x_2])
        return self.p_2[x_2]

    def union_2(self, x_2_a, x_2_b):
        ra_2 = self.find_2(x_2_a)
        rb_2 = self.find_2(x_2_b)
        if ra_2 != rb_2:
            if self.rk_2[ra_2] < self.rk_2[rb_2]:
                ra_2, rb_2 = rb_2, ra_2
            self.p_2[rb_2] = ra_2
            if self.rk_2[ra_2] == self.rk_2[rb_2]:
                self.rk_2[ra_2] += 1
            return True
        return False

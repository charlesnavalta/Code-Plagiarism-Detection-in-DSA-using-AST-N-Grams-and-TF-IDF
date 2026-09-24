class DSU_0:
    def __init__(self, n_0):
        self.p_0 = list(range(n_0))
        self.rk_0 = [0] * n_0

    def find_0(self, x_0):
        if self.p_0[x_0] != x_0:
            self.p_0[x_0] = self.find_0(self.p_0[x_0])
        return self.p_0[x_0]

    def union_0(self, x_0_a, x_0_b):
        ra_0 = self.find_0(x_0_a)
        rb_0 = self.find_0(x_0_b)
        if ra_0 != rb_0:
            if self.rk_0[ra_0] < self.rk_0[rb_0]:
                ra_0, rb_0 = rb_0, ra_0
            self.p_0[rb_0] = ra_0
            if self.rk_0[ra_0] == self.rk_0[rb_0]:
                self.rk_0[ra_0] += 1
            return True
        return False

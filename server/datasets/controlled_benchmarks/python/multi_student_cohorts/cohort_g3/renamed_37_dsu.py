class DSU_1:
    def __init__(self, n_1):
        self.p_1 = list(range(n_1))
        self.rk_1 = [0] * n_1

    def find_1(self, x_1):
        if self.p_1[x_1] != x_1:
            self.p_1[x_1] = self.find_1(self.p_1[x_1])
        return self.p_1[x_1]

    def union_1(self, x_1_a, x_1_b):
        ra_1 = self.find_1(x_1_a)
        rb_1 = self.find_1(x_1_b)
        if ra_1 != rb_1:
            if self.rk_1[ra_1] < self.rk_1[rb_1]:
                ra_1, rb_1 = rb_1, ra_1
            self.p_1[rb_1] = ra_1
            if self.rk_1[ra_1] == self.rk_1[rb_1]:
                self.rk_1[ra_1] += 1
            return True
        return False

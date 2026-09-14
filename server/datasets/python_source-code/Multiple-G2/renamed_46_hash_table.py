class Table_10:
    def __init__(self, cap_10=16):
        self.cap_10 = cap_10
        self.bks_10 = [[] for _ in range(cap_10)]

    def hf_10(self, k_10):
        return hash(k_10) % self.cap_10

    def put_10(self, k_10, v_10):
        idx = self.hf_10(k_10)
        for p_10 in self.bks_10[idx]:
            if p_10[0] == k_10:
                p_10[1] = v_10
                return
        self.bks_10[idx].append([k_10, v_10])

    def get_10(self, k_10):
        idx = self.hf_10(k_10)
        for p_10 in self.bks_10[idx]:
            if p_10[0] == k_10:
                return p_10[1]
        return None

    def rm_10(self, k_10):
        idx = self.hf_10(k_10)
        for i, p_10 in enumerate(self.bks_10[idx]):
            if p_10[0] == k_10:
                return self.bks_10[idx].pop(i)
        return None

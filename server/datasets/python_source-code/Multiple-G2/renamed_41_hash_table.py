class Table_5:
    def __init__(self, cap_5=16):
        self.cap_5 = cap_5
        self.bks_5 = [[] for _ in range(cap_5)]

    def hf_5(self, k_5):
        return hash(k_5) % self.cap_5

    def put_5(self, k_5, v_5):
        idx = self.hf_5(k_5)
        for p_5 in self.bks_5[idx]:
            if p_5[0] == k_5:
                p_5[1] = v_5
                return
        self.bks_5[idx].append([k_5, v_5])

    def get_5(self, k_5):
        idx = self.hf_5(k_5)
        for p_5 in self.bks_5[idx]:
            if p_5[0] == k_5:
                return p_5[1]
        return None

    def rm_5(self, k_5):
        idx = self.hf_5(k_5)
        for i, p_5 in enumerate(self.bks_5[idx]):
            if p_5[0] == k_5:
                return self.bks_5[idx].pop(i)
        return None

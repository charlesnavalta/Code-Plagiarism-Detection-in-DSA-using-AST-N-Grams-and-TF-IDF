class Table_6:
    def __init__(self, cap_6=16):
        self.cap_6 = cap_6
        self.bks_6 = [[] for _ in range(cap_6)]

    def hf_6(self, k_6):
        return hash(k_6) % self.cap_6

    def put_6(self, k_6, v_6):
        idx = self.hf_6(k_6)
        for p_6 in self.bks_6[idx]:
            if p_6[0] == k_6:
                p_6[1] = v_6
                return
        self.bks_6[idx].append([k_6, v_6])

    def get_6(self, k_6):
        idx = self.hf_6(k_6)
        for p_6 in self.bks_6[idx]:
            if p_6[0] == k_6:
                return p_6[1]
        return None

    def rm_6(self, k_6):
        idx = self.hf_6(k_6)
        for i, p_6 in enumerate(self.bks_6[idx]):
            if p_6[0] == k_6:
                return self.bks_6[idx].pop(i)
        return None

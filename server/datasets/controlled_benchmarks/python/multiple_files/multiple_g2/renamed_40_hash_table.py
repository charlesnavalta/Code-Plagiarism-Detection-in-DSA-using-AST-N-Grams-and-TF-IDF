class Table_4:
    def __init__(self, cap_4=16):
        self.cap_4 = cap_4
        self.bks_4 = [[] for _ in range(cap_4)]

    def hf_4(self, k_4):
        return hash(k_4) % self.cap_4

    def put_4(self, k_4, v_4):
        idx = self.hf_4(k_4)
        for p_4 in self.bks_4[idx]:
            if p_4[0] == k_4:
                p_4[1] = v_4
                return
        self.bks_4[idx].append([k_4, v_4])

    def get_4(self, k_4):
        idx = self.hf_4(k_4)
        for p_4 in self.bks_4[idx]:
            if p_4[0] == k_4:
                return p_4[1]
        return None

    def rm_4(self, k_4):
        idx = self.hf_4(k_4)
        for i, p_4 in enumerate(self.bks_4[idx]):
            if p_4[0] == k_4:
                return self.bks_4[idx].pop(i)
        return None

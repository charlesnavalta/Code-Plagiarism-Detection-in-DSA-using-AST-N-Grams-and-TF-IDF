class Table_8:
    def __init__(self, cap_8=16):
        self.cap_8 = cap_8
        self.bks_8 = [[] for _ in range(cap_8)]

    def hf_8(self, k_8):
        return hash(k_8) % self.cap_8

    def put_8(self, k_8, v_8):
        idx = self.hf_8(k_8)
        for p_8 in self.bks_8[idx]:
            if p_8[0] == k_8:
                p_8[1] = v_8
                return
        self.bks_8[idx].append([k_8, v_8])

    def get_8(self, k_8):
        idx = self.hf_8(k_8)
        for p_8 in self.bks_8[idx]:
            if p_8[0] == k_8:
                return p_8[1]
        return None

    def rm_8(self, k_8):
        idx = self.hf_8(k_8)
        for i, p_8 in enumerate(self.bks_8[idx]):
            if p_8[0] == k_8:
                return self.bks_8[idx].pop(i)
        return None

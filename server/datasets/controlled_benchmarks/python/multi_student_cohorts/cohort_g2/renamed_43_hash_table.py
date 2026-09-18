class Table_7:
    def __init__(self, cap_7=16):
        self.cap_7 = cap_7
        self.bks_7 = [[] for _ in range(cap_7)]

    def hf_7(self, k_7):
        return hash(k_7) % self.cap_7

    def put_7(self, k_7, v_7):
        idx = self.hf_7(k_7)
        for p_7 in self.bks_7[idx]:
            if p_7[0] == k_7:
                p_7[1] = v_7
                return
        self.bks_7[idx].append([k_7, v_7])

    def get_7(self, k_7):
        idx = self.hf_7(k_7)
        for p_7 in self.bks_7[idx]:
            if p_7[0] == k_7:
                return p_7[1]
        return None

    def rm_7(self, k_7):
        idx = self.hf_7(k_7)
        for i, p_7 in enumerate(self.bks_7[idx]):
            if p_7[0] == k_7:
                return self.bks_7[idx].pop(i)
        return None

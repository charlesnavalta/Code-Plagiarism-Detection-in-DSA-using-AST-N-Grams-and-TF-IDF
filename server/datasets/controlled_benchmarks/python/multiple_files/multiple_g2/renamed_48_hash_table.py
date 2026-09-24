class Table_12:
    def __init__(self, cap_12=16):
        self.cap_12 = cap_12
        self.bks_12 = [[] for _ in range(cap_12)]

    def hf_12(self, k_12):
        return hash(k_12) % self.cap_12

    def put_12(self, k_12, v_12):
        idx = self.hf_12(k_12)
        for p_12 in self.bks_12[idx]:
            if p_12[0] == k_12:
                p_12[1] = v_12
                return
        self.bks_12[idx].append([k_12, v_12])

    def get_12(self, k_12):
        idx = self.hf_12(k_12)
        for p_12 in self.bks_12[idx]:
            if p_12[0] == k_12:
                return p_12[1]
        return None

    def rm_12(self, k_12):
        idx = self.hf_12(k_12)
        for i, p_12 in enumerate(self.bks_12[idx]):
            if p_12[0] == k_12:
                return self.bks_12[idx].pop(i)
        return None

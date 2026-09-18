class Table_13:
    def __init__(self, cap_13=16):
        self.cap_13 = cap_13
        self.bks_13 = [[] for _ in range(cap_13)]

    def hf_13(self, k_13):
        return hash(k_13) % self.cap_13

    def put_13(self, k_13, v_13):
        idx = self.hf_13(k_13)
        for p_13 in self.bks_13[idx]:
            if p_13[0] == k_13:
                p_13[1] = v_13
                return
        self.bks_13[idx].append([k_13, v_13])

    def get_13(self, k_13):
        idx = self.hf_13(k_13)
        for p_13 in self.bks_13[idx]:
            if p_13[0] == k_13:
                return p_13[1]
        return None

    def rm_13(self, k_13):
        idx = self.hf_13(k_13)
        for i, p_13 in enumerate(self.bks_13[idx]):
            if p_13[0] == k_13:
                return self.bks_13[idx].pop(i)
        return None

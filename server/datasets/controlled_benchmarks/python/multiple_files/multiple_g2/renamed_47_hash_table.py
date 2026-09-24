class Table_11:
    def __init__(self, cap_11=16):
        self.cap_11 = cap_11
        self.bks_11 = [[] for _ in range(cap_11)]

    def hf_11(self, k_11):
        return hash(k_11) % self.cap_11

    def put_11(self, k_11, v_11):
        idx = self.hf_11(k_11)
        for p_11 in self.bks_11[idx]:
            if p_11[0] == k_11:
                p_11[1] = v_11
                return
        self.bks_11[idx].append([k_11, v_11])

    def get_11(self, k_11):
        idx = self.hf_11(k_11)
        for p_11 in self.bks_11[idx]:
            if p_11[0] == k_11:
                return p_11[1]
        return None

    def rm_11(self, k_11):
        idx = self.hf_11(k_11)
        for i, p_11 in enumerate(self.bks_11[idx]):
            if p_11[0] == k_11:
                return self.bks_11[idx].pop(i)
        return None

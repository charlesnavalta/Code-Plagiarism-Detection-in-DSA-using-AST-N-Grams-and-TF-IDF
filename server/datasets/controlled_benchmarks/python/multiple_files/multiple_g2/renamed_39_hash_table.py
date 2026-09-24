class Table_3:
    def __init__(self, cap_3=16):
        self.cap_3 = cap_3
        self.bks_3 = [[] for _ in range(cap_3)]

    def hf_3(self, k_3):
        return hash(k_3) % self.cap_3

    def put_3(self, k_3, v_3):
        idx = self.hf_3(k_3)
        for p_3 in self.bks_3[idx]:
            if p_3[0] == k_3:
                p_3[1] = v_3
                return
        self.bks_3[idx].append([k_3, v_3])

    def get_3(self, k_3):
        idx = self.hf_3(k_3)
        for p_3 in self.bks_3[idx]:
            if p_3[0] == k_3:
                return p_3[1]
        return None

    def rm_3(self, k_3):
        idx = self.hf_3(k_3)
        for i, p_3 in enumerate(self.bks_3[idx]):
            if p_3[0] == k_3:
                return self.bks_3[idx].pop(i)
        return None

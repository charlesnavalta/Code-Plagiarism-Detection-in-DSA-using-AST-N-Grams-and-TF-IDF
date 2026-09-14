class Table_2:
    def __init__(self, cap_2=16):
        self.cap_2 = cap_2
        self.bks_2 = [[] for _ in range(cap_2)]

    def hf_2(self, k_2):
        return hash(k_2) % self.cap_2

    def put_2(self, k_2, v_2):
        idx = self.hf_2(k_2)
        for p_2 in self.bks_2[idx]:
            if p_2[0] == k_2:
                p_2[1] = v_2
                return
        self.bks_2[idx].append([k_2, v_2])

    def get_2(self, k_2):
        idx = self.hf_2(k_2)
        for p_2 in self.bks_2[idx]:
            if p_2[0] == k_2:
                return p_2[1]
        return None

    def rm_2(self, k_2):
        idx = self.hf_2(k_2)
        for i, p_2 in enumerate(self.bks_2[idx]):
            if p_2[0] == k_2:
                return self.bks_2[idx].pop(i)
        return None

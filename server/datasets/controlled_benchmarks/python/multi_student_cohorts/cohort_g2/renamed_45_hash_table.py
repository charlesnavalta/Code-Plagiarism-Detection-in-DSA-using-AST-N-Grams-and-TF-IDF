class Table_9:
    def __init__(self, cap_9=16):
        self.cap_9 = cap_9
        self.bks_9 = [[] for _ in range(cap_9)]

    def hf_9(self, k_9):
        return hash(k_9) % self.cap_9

    def put_9(self, k_9, v_9):
        idx = self.hf_9(k_9)
        for p_9 in self.bks_9[idx]:
            if p_9[0] == k_9:
                p_9[1] = v_9
                return
        self.bks_9[idx].append([k_9, v_9])

    def get_9(self, k_9):
        idx = self.hf_9(k_9)
        for p_9 in self.bks_9[idx]:
            if p_9[0] == k_9:
                return p_9[1]
        return None

    def rm_9(self, k_9):
        idx = self.hf_9(k_9)
        for i, p_9 in enumerate(self.bks_9[idx]):
            if p_9[0] == k_9:
                return self.bks_9[idx].pop(i)
        return None

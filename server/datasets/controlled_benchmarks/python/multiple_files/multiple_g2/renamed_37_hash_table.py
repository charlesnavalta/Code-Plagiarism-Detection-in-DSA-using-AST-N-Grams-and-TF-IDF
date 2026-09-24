class Table_1:
    def __init__(self, cap_1=16):
        self.cap_1 = cap_1
        self.bks_1 = [[] for _ in range(cap_1)]

    def hf_1(self, k_1):
        return hash(k_1) % self.cap_1

    def put_1(self, k_1, v_1):
        idx = self.hf_1(k_1)
        for p_1 in self.bks_1[idx]:
            if p_1[0] == k_1:
                p_1[1] = v_1
                return
        self.bks_1[idx].append([k_1, v_1])

    def get_1(self, k_1):
        idx = self.hf_1(k_1)
        for p_1 in self.bks_1[idx]:
            if p_1[0] == k_1:
                return p_1[1]
        return None

    def rm_1(self, k_1):
        idx = self.hf_1(k_1)
        for i, p_1 in enumerate(self.bks_1[idx]):
            if p_1[0] == k_1:
                return self.bks_1[idx].pop(i)
        return None

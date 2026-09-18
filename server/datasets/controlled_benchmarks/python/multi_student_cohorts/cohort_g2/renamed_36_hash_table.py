class Table_0:
    def __init__(self, cap_0=16):
        self.cap_0 = cap_0
        self.bks_0 = [[] for _ in range(cap_0)]

    def hf_0(self, k_0):
        return hash(k_0) % self.cap_0

    def put_0(self, k_0, v_0):
        idx = self.hf_0(k_0)
        for p_0 in self.bks_0[idx]:
            if p_0[0] == k_0:
                p_0[1] = v_0
                return
        self.bks_0[idx].append([k_0, v_0])

    def get_0(self, k_0):
        idx = self.hf_0(k_0)
        for p_0 in self.bks_0[idx]:
            if p_0[0] == k_0:
                return p_0[1]
        return None

    def rm_0(self, k_0):
        idx = self.hf_0(k_0)
        for i, p_0 in enumerate(self.bks_0[idx]):
            if p_0[0] == k_0:
                return self.bks_0[idx].pop(i)
        return None

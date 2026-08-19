class N:
    def __init__(self, val):
        self.val = val
        self.l = None
        self.r = None


class BSTree:
    def __init__(self):
        self.rt = None

    def ins(self, nd, val):
        if nd is None:
            return N(val)

        if val < nd.val:
            nd.l = self.ins(nd.l, val)
        else:
            nd.r = self.ins(nd.r, val)

        return nd

    def srch(self, nd, val):
        if nd is None or nd.val == val:
            return nd

        if val < nd.val:
            return self.srch(nd.l, val)

        return self.srch(nd.r, val)


if __name__ == "__main__":
    t = BSTree()
    arr = [50, 30, 70, 20, 40, 60, 80]

    for x in arr:
        t.rt = t.ins(t.rt, x)

    res = t.srch(t.rt, 60)
    print("Found" if res else "Not Found")
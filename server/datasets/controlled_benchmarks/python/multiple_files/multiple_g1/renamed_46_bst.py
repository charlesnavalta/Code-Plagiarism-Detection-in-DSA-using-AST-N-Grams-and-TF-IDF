class Node_10:
    def __init__(self, val_10):
        self.val_10 = val_10
        self.lhs_10 = None
        self.rhs_10 = None

class Tree_10:
    def __init__(self):
        self.rt_10 = None

    def ins_10(self, val_10):
        if self.rt_10 is None:
            self.rt_10 = Node_10(val_10)
        else:
            self._ins_10_rec(self.rt_10, val_10)

    def _ins_10_rec(self, nd_10, val_10):
        if val_10 < nd_10.val_10:
            if nd_10.lhs_10 is None:
                nd_10.lhs_10 = Node_10(val_10)
            else:
                self._ins_10_rec(nd_10.lhs_10, val_10)
        elif val_10 > nd_10.val_10:
            if nd_10.rhs_10 is None:
                nd_10.rhs_10 = Node_10(val_10)
            else:
                self._ins_10_rec(nd_10.rhs_10, val_10)

    def srch_10(self, val_10):
        return self._srch_10_rec(self.rt_10, val_10)

    def _srch_10_rec(self, nd_10, val_10):
        if nd_10 is None or nd_10.val_10 == val_10:
            return nd_10
        if val_10 < nd_10.val_10:
            return self._srch_10_rec(nd_10.lhs_10, val_10)
        return self._srch_10_rec(nd_10.rhs_10, val_10)

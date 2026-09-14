class Node_0:
    def __init__(self, val_0):
        self.val_0 = val_0
        self.lhs_0 = None
        self.rhs_0 = None

class Tree_0:
    def __init__(self):
        self.rt_0 = None

    def ins_0(self, val_0):
        if self.rt_0 is None:
            self.rt_0 = Node_0(val_0)
        else:
            self._ins_0_rec(self.rt_0, val_0)

    def _ins_0_rec(self, nd_0, val_0):
        if val_0 < nd_0.val_0:
            if nd_0.lhs_0 is None:
                nd_0.lhs_0 = Node_0(val_0)
            else:
                self._ins_0_rec(nd_0.lhs_0, val_0)
        elif val_0 > nd_0.val_0:
            if nd_0.rhs_0 is None:
                nd_0.rhs_0 = Node_0(val_0)
            else:
                self._ins_0_rec(nd_0.rhs_0, val_0)

    def srch_0(self, val_0):
        return self._srch_0_rec(self.rt_0, val_0)

    def _srch_0_rec(self, nd_0, val_0):
        if nd_0 is None or nd_0.val_0 == val_0:
            return nd_0
        if val_0 < nd_0.val_0:
            return self._srch_0_rec(nd_0.lhs_0, val_0)
        return self._srch_0_rec(nd_0.rhs_0, val_0)

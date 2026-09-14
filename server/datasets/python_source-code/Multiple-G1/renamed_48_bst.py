class Node_12:
    def __init__(self, val_12):
        self.val_12 = val_12
        self.lhs_12 = None
        self.rhs_12 = None

class Tree_12:
    def __init__(self):
        self.rt_12 = None

    def ins_12(self, val_12):
        if self.rt_12 is None:
            self.rt_12 = Node_12(val_12)
        else:
            self._ins_12_rec(self.rt_12, val_12)

    def _ins_12_rec(self, nd_12, val_12):
        if val_12 < nd_12.val_12:
            if nd_12.lhs_12 is None:
                nd_12.lhs_12 = Node_12(val_12)
            else:
                self._ins_12_rec(nd_12.lhs_12, val_12)
        elif val_12 > nd_12.val_12:
            if nd_12.rhs_12 is None:
                nd_12.rhs_12 = Node_12(val_12)
            else:
                self._ins_12_rec(nd_12.rhs_12, val_12)

    def srch_12(self, val_12):
        return self._srch_12_rec(self.rt_12, val_12)

    def _srch_12_rec(self, nd_12, val_12):
        if nd_12 is None or nd_12.val_12 == val_12:
            return nd_12
        if val_12 < nd_12.val_12:
            return self._srch_12_rec(nd_12.lhs_12, val_12)
        return self._srch_12_rec(nd_12.rhs_12, val_12)

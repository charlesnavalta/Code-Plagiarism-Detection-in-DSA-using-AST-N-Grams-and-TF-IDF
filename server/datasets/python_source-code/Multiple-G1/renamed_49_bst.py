class Node_13:
    def __init__(self, val_13):
        self.val_13 = val_13
        self.lhs_13 = None
        self.rhs_13 = None

class Tree_13:
    def __init__(self):
        self.rt_13 = None

    def ins_13(self, val_13):
        if self.rt_13 is None:
            self.rt_13 = Node_13(val_13)
        else:
            self._ins_13_rec(self.rt_13, val_13)

    def _ins_13_rec(self, nd_13, val_13):
        if val_13 < nd_13.val_13:
            if nd_13.lhs_13 is None:
                nd_13.lhs_13 = Node_13(val_13)
            else:
                self._ins_13_rec(nd_13.lhs_13, val_13)
        elif val_13 > nd_13.val_13:
            if nd_13.rhs_13 is None:
                nd_13.rhs_13 = Node_13(val_13)
            else:
                self._ins_13_rec(nd_13.rhs_13, val_13)

    def srch_13(self, val_13):
        return self._srch_13_rec(self.rt_13, val_13)

    def _srch_13_rec(self, nd_13, val_13):
        if nd_13 is None or nd_13.val_13 == val_13:
            return nd_13
        if val_13 < nd_13.val_13:
            return self._srch_13_rec(nd_13.lhs_13, val_13)
        return self._srch_13_rec(nd_13.rhs_13, val_13)

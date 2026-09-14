class Node_7:
    def __init__(self, val_7):
        self.val_7 = val_7
        self.lhs_7 = None
        self.rhs_7 = None

class Tree_7:
    def __init__(self):
        self.rt_7 = None

    def ins_7(self, val_7):
        if self.rt_7 is None:
            self.rt_7 = Node_7(val_7)
        else:
            self._ins_7_rec(self.rt_7, val_7)

    def _ins_7_rec(self, nd_7, val_7):
        if val_7 < nd_7.val_7:
            if nd_7.lhs_7 is None:
                nd_7.lhs_7 = Node_7(val_7)
            else:
                self._ins_7_rec(nd_7.lhs_7, val_7)
        elif val_7 > nd_7.val_7:
            if nd_7.rhs_7 is None:
                nd_7.rhs_7 = Node_7(val_7)
            else:
                self._ins_7_rec(nd_7.rhs_7, val_7)

    def srch_7(self, val_7):
        return self._srch_7_rec(self.rt_7, val_7)

    def _srch_7_rec(self, nd_7, val_7):
        if nd_7 is None or nd_7.val_7 == val_7:
            return nd_7
        if val_7 < nd_7.val_7:
            return self._srch_7_rec(nd_7.lhs_7, val_7)
        return self._srch_7_rec(nd_7.rhs_7, val_7)

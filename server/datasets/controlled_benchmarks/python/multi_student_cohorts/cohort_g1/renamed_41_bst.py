class Node_5:
    def __init__(self, val_5):
        self.val_5 = val_5
        self.lhs_5 = None
        self.rhs_5 = None

class Tree_5:
    def __init__(self):
        self.rt_5 = None

    def ins_5(self, val_5):
        if self.rt_5 is None:
            self.rt_5 = Node_5(val_5)
        else:
            self._ins_5_rec(self.rt_5, val_5)

    def _ins_5_rec(self, nd_5, val_5):
        if val_5 < nd_5.val_5:
            if nd_5.lhs_5 is None:
                nd_5.lhs_5 = Node_5(val_5)
            else:
                self._ins_5_rec(nd_5.lhs_5, val_5)
        elif val_5 > nd_5.val_5:
            if nd_5.rhs_5 is None:
                nd_5.rhs_5 = Node_5(val_5)
            else:
                self._ins_5_rec(nd_5.rhs_5, val_5)

    def srch_5(self, val_5):
        return self._srch_5_rec(self.rt_5, val_5)

    def _srch_5_rec(self, nd_5, val_5):
        if nd_5 is None or nd_5.val_5 == val_5:
            return nd_5
        if val_5 < nd_5.val_5:
            return self._srch_5_rec(nd_5.lhs_5, val_5)
        return self._srch_5_rec(nd_5.rhs_5, val_5)

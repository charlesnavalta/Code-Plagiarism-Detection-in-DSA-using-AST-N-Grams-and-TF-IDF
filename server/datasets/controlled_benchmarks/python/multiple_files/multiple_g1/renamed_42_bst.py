class Node_6:
    def __init__(self, val_6):
        self.val_6 = val_6
        self.lhs_6 = None
        self.rhs_6 = None

class Tree_6:
    def __init__(self):
        self.rt_6 = None

    def ins_6(self, val_6):
        if self.rt_6 is None:
            self.rt_6 = Node_6(val_6)
        else:
            self._ins_6_rec(self.rt_6, val_6)

    def _ins_6_rec(self, nd_6, val_6):
        if val_6 < nd_6.val_6:
            if nd_6.lhs_6 is None:
                nd_6.lhs_6 = Node_6(val_6)
            else:
                self._ins_6_rec(nd_6.lhs_6, val_6)
        elif val_6 > nd_6.val_6:
            if nd_6.rhs_6 is None:
                nd_6.rhs_6 = Node_6(val_6)
            else:
                self._ins_6_rec(nd_6.rhs_6, val_6)

    def srch_6(self, val_6):
        return self._srch_6_rec(self.rt_6, val_6)

    def _srch_6_rec(self, nd_6, val_6):
        if nd_6 is None or nd_6.val_6 == val_6:
            return nd_6
        if val_6 < nd_6.val_6:
            return self._srch_6_rec(nd_6.lhs_6, val_6)
        return self._srch_6_rec(nd_6.rhs_6, val_6)

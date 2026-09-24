class Node_4:
    def __init__(self, val_4):
        self.val_4 = val_4
        self.lhs_4 = None
        self.rhs_4 = None

class Tree_4:
    def __init__(self):
        self.rt_4 = None

    def ins_4(self, val_4):
        if self.rt_4 is None:
            self.rt_4 = Node_4(val_4)
        else:
            self._ins_4_rec(self.rt_4, val_4)

    def _ins_4_rec(self, nd_4, val_4):
        if val_4 < nd_4.val_4:
            if nd_4.lhs_4 is None:
                nd_4.lhs_4 = Node_4(val_4)
            else:
                self._ins_4_rec(nd_4.lhs_4, val_4)
        elif val_4 > nd_4.val_4:
            if nd_4.rhs_4 is None:
                nd_4.rhs_4 = Node_4(val_4)
            else:
                self._ins_4_rec(nd_4.rhs_4, val_4)

    def srch_4(self, val_4):
        return self._srch_4_rec(self.rt_4, val_4)

    def _srch_4_rec(self, nd_4, val_4):
        if nd_4 is None or nd_4.val_4 == val_4:
            return nd_4
        if val_4 < nd_4.val_4:
            return self._srch_4_rec(nd_4.lhs_4, val_4)
        return self._srch_4_rec(nd_4.rhs_4, val_4)

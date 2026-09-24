class Node_2:
    def __init__(self, val_2):
        self.val_2 = val_2
        self.lhs_2 = None
        self.rhs_2 = None

class Tree_2:
    def __init__(self):
        self.rt_2 = None

    def ins_2(self, val_2):
        if self.rt_2 is None:
            self.rt_2 = Node_2(val_2)
        else:
            self._ins_2_rec(self.rt_2, val_2)

    def _ins_2_rec(self, nd_2, val_2):
        if val_2 < nd_2.val_2:
            if nd_2.lhs_2 is None:
                nd_2.lhs_2 = Node_2(val_2)
            else:
                self._ins_2_rec(nd_2.lhs_2, val_2)
        elif val_2 > nd_2.val_2:
            if nd_2.rhs_2 is None:
                nd_2.rhs_2 = Node_2(val_2)
            else:
                self._ins_2_rec(nd_2.rhs_2, val_2)

    def srch_2(self, val_2):
        return self._srch_2_rec(self.rt_2, val_2)

    def _srch_2_rec(self, nd_2, val_2):
        if nd_2 is None or nd_2.val_2 == val_2:
            return nd_2
        if val_2 < nd_2.val_2:
            return self._srch_2_rec(nd_2.lhs_2, val_2)
        return self._srch_2_rec(nd_2.rhs_2, val_2)

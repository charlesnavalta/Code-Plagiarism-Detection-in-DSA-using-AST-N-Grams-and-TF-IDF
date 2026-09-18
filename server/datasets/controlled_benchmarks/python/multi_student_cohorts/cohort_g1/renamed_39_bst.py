class Node_3:
    def __init__(self, val_3):
        self.val_3 = val_3
        self.lhs_3 = None
        self.rhs_3 = None

class Tree_3:
    def __init__(self):
        self.rt_3 = None

    def ins_3(self, val_3):
        if self.rt_3 is None:
            self.rt_3 = Node_3(val_3)
        else:
            self._ins_3_rec(self.rt_3, val_3)

    def _ins_3_rec(self, nd_3, val_3):
        if val_3 < nd_3.val_3:
            if nd_3.lhs_3 is None:
                nd_3.lhs_3 = Node_3(val_3)
            else:
                self._ins_3_rec(nd_3.lhs_3, val_3)
        elif val_3 > nd_3.val_3:
            if nd_3.rhs_3 is None:
                nd_3.rhs_3 = Node_3(val_3)
            else:
                self._ins_3_rec(nd_3.rhs_3, val_3)

    def srch_3(self, val_3):
        return self._srch_3_rec(self.rt_3, val_3)

    def _srch_3_rec(self, nd_3, val_3):
        if nd_3 is None or nd_3.val_3 == val_3:
            return nd_3
        if val_3 < nd_3.val_3:
            return self._srch_3_rec(nd_3.lhs_3, val_3)
        return self._srch_3_rec(nd_3.rhs_3, val_3)

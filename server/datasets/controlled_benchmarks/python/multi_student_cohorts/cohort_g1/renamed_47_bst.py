class Node_11:
    def __init__(self, val_11):
        self.val_11 = val_11
        self.lhs_11 = None
        self.rhs_11 = None

class Tree_11:
    def __init__(self):
        self.rt_11 = None

    def ins_11(self, val_11):
        if self.rt_11 is None:
            self.rt_11 = Node_11(val_11)
        else:
            self._ins_11_rec(self.rt_11, val_11)

    def _ins_11_rec(self, nd_11, val_11):
        if val_11 < nd_11.val_11:
            if nd_11.lhs_11 is None:
                nd_11.lhs_11 = Node_11(val_11)
            else:
                self._ins_11_rec(nd_11.lhs_11, val_11)
        elif val_11 > nd_11.val_11:
            if nd_11.rhs_11 is None:
                nd_11.rhs_11 = Node_11(val_11)
            else:
                self._ins_11_rec(nd_11.rhs_11, val_11)

    def srch_11(self, val_11):
        return self._srch_11_rec(self.rt_11, val_11)

    def _srch_11_rec(self, nd_11, val_11):
        if nd_11 is None or nd_11.val_11 == val_11:
            return nd_11
        if val_11 < nd_11.val_11:
            return self._srch_11_rec(nd_11.lhs_11, val_11)
        return self._srch_11_rec(nd_11.rhs_11, val_11)

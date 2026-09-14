class Node_1:
    def __init__(self, val_1):
        self.val_1 = val_1
        self.lhs_1 = None
        self.rhs_1 = None

class Tree_1:
    def __init__(self):
        self.rt_1 = None

    def ins_1(self, val_1):
        if self.rt_1 is None:
            self.rt_1 = Node_1(val_1)
        else:
            self._ins_1_rec(self.rt_1, val_1)

    def _ins_1_rec(self, nd_1, val_1):
        if val_1 < nd_1.val_1:
            if nd_1.lhs_1 is None:
                nd_1.lhs_1 = Node_1(val_1)
            else:
                self._ins_1_rec(nd_1.lhs_1, val_1)
        elif val_1 > nd_1.val_1:
            if nd_1.rhs_1 is None:
                nd_1.rhs_1 = Node_1(val_1)
            else:
                self._ins_1_rec(nd_1.rhs_1, val_1)

    def srch_1(self, val_1):
        return self._srch_1_rec(self.rt_1, val_1)

    def _srch_1_rec(self, nd_1, val_1):
        if nd_1 is None or nd_1.val_1 == val_1:
            return nd_1
        if val_1 < nd_1.val_1:
            return self._srch_1_rec(nd_1.lhs_1, val_1)
        return self._srch_1_rec(nd_1.rhs_1, val_1)

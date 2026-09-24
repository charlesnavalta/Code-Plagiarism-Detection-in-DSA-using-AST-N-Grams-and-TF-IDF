class Node_9:
    def __init__(self, val_9):
        self.val_9 = val_9
        self.lhs_9 = None
        self.rhs_9 = None

class Tree_9:
    def __init__(self):
        self.rt_9 = None

    def ins_9(self, val_9):
        if self.rt_9 is None:
            self.rt_9 = Node_9(val_9)
        else:
            self._ins_9_rec(self.rt_9, val_9)

    def _ins_9_rec(self, nd_9, val_9):
        if val_9 < nd_9.val_9:
            if nd_9.lhs_9 is None:
                nd_9.lhs_9 = Node_9(val_9)
            else:
                self._ins_9_rec(nd_9.lhs_9, val_9)
        elif val_9 > nd_9.val_9:
            if nd_9.rhs_9 is None:
                nd_9.rhs_9 = Node_9(val_9)
            else:
                self._ins_9_rec(nd_9.rhs_9, val_9)

    def srch_9(self, val_9):
        return self._srch_9_rec(self.rt_9, val_9)

    def _srch_9_rec(self, nd_9, val_9):
        if nd_9 is None or nd_9.val_9 == val_9:
            return nd_9
        if val_9 < nd_9.val_9:
            return self._srch_9_rec(nd_9.lhs_9, val_9)
        return self._srch_9_rec(nd_9.rhs_9, val_9)

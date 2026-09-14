class Node_8:
    def __init__(self, val_8):
        self.val_8 = val_8
        self.lhs_8 = None
        self.rhs_8 = None

class Tree_8:
    def __init__(self):
        self.rt_8 = None

    def ins_8(self, val_8):
        if self.rt_8 is None:
            self.rt_8 = Node_8(val_8)
        else:
            self._ins_8_rec(self.rt_8, val_8)

    def _ins_8_rec(self, nd_8, val_8):
        if val_8 < nd_8.val_8:
            if nd_8.lhs_8 is None:
                nd_8.lhs_8 = Node_8(val_8)
            else:
                self._ins_8_rec(nd_8.lhs_8, val_8)
        elif val_8 > nd_8.val_8:
            if nd_8.rhs_8 is None:
                nd_8.rhs_8 = Node_8(val_8)
            else:
                self._ins_8_rec(nd_8.rhs_8, val_8)

    def srch_8(self, val_8):
        return self._srch_8_rec(self.rt_8, val_8)

    def _srch_8_rec(self, nd_8, val_8):
        if nd_8 is None or nd_8.val_8 == val_8:
            return nd_8
        if val_8 < nd_8.val_8:
            return self._srch_8_rec(nd_8.lhs_8, val_8)
        return self._srch_8_rec(nd_8.rhs_8, val_8)

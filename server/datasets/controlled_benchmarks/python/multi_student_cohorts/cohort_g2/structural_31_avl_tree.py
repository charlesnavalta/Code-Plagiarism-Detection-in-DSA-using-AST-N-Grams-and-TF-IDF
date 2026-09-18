class Node_6:
    def __init__(self, v_6):
        self.v_6 = v_6
        self.r_6 = None
        self.l_6 = None
        self.height = 1

def h_6(node):
    if not node:
        return 0
    return node.height

def b_6(node):
    if not node:
        return 0
    return h_6(node.l_6) - h_6(node.r_6)

def rr_6(y):
    x = y.l_6
    sub = x.r_6
    x.r_6 = y
    y.l_6 = sub
    y.height = 1 + max(h_6(y.l_6), h_6(y.r_6))
    x.height = 1 + max(h_6(x.l_6), h_6(x.r_6))
    return x

def rl_6(x):
    y = x.r_6
    sub = y.l_6
    y.l_6 = x
    x.r_6 = sub
    x.height = 1 + max(h_6(x.l_6), h_6(x.r_6))
    y.height = 1 + max(h_6(y.l_6), h_6(y.r_6))
    return y

def ins_6(rt_6, v_6):
    if not rt_6:
        return Node_6(v_6)
    if v_6 < rt_6.v_6:
        rt_6.l_6 = ins_6(rt_6.l_6, v_6)
    elif v_6 > rt_6.v_6:
        rt_6.r_6 = ins_6(rt_6.r_6, v_6)
    else:
        return rt_6

    rt_6.height = 1 + max(h_6(rt_6.l_6), h_6(rt_6.r_6))
    bf_6 = b_6(rt_6)

    if bf_6 > 1 and v_6 < rt_6.l_6.v_6:
        return rr_6(rt_6)
    if bf_6 < -1 and v_6 > rt_6.r_6.v_6:
        return rl_6(rt_6)
    if bf_6 > 1 and v_6 > rt_6.l_6.v_6:
        rt_6.l_6 = rl_6(rt_6.l_6)
        return rr_6(rt_6)
    if bf_6 < -1 and v_6 < rt_6.r_6.v_6:
        rt_6.r_6 = rr_6(rt_6.r_6)
        return rl_6(rt_6)

    return rt_6

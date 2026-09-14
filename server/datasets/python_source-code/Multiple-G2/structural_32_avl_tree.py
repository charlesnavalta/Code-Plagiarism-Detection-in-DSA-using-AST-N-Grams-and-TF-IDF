class Node_7:
    def __init__(self, v_7):
        self.v_7 = v_7
        self.r_7 = None
        self.l_7 = None
        self.height = 1

def h_7(node):
    if not node:
        return 0
    return node.height

def b_7(node):
    if not node:
        return 0
    return h_7(node.l_7) - h_7(node.r_7)

def rr_7(y):
    x = y.l_7
    sub = x.r_7
    x.r_7 = y
    y.l_7 = sub
    y.height = 1 + max(h_7(y.l_7), h_7(y.r_7))
    x.height = 1 + max(h_7(x.l_7), h_7(x.r_7))
    return x

def rl_7(x):
    y = x.r_7
    sub = y.l_7
    y.l_7 = x
    x.r_7 = sub
    x.height = 1 + max(h_7(x.l_7), h_7(x.r_7))
    y.height = 1 + max(h_7(y.l_7), h_7(y.r_7))
    return y

def ins_7(rt_7, v_7):
    if not rt_7:
        return Node_7(v_7)
    if v_7 < rt_7.v_7:
        rt_7.l_7 = ins_7(rt_7.l_7, v_7)
    elif v_7 > rt_7.v_7:
        rt_7.r_7 = ins_7(rt_7.r_7, v_7)
    else:
        return rt_7

    rt_7.height = 1 + max(h_7(rt_7.l_7), h_7(rt_7.r_7))
    bf_7 = b_7(rt_7)

    if bf_7 > 1 and v_7 < rt_7.l_7.v_7:
        return rr_7(rt_7)
    if bf_7 < -1 and v_7 > rt_7.r_7.v_7:
        return rl_7(rt_7)
    if bf_7 > 1 and v_7 > rt_7.l_7.v_7:
        rt_7.l_7 = rl_7(rt_7.l_7)
        return rr_7(rt_7)
    if bf_7 < -1 and v_7 < rt_7.r_7.v_7:
        rt_7.r_7 = rr_7(rt_7.r_7)
        return rl_7(rt_7)

    return rt_7

class Node_8:
    def __init__(self, v_8):
        self.v_8 = v_8
        self.r_8 = None
        self.l_8 = None
        self.height = 1

def h_8(node):
    if not node:
        return 0
    return node.height

def b_8(node):
    if not node:
        return 0
    return h_8(node.l_8) - h_8(node.r_8)

def rr_8(y):
    x = y.l_8
    sub = x.r_8
    x.r_8 = y
    y.l_8 = sub
    y.height = 1 + max(h_8(y.l_8), h_8(y.r_8))
    x.height = 1 + max(h_8(x.l_8), h_8(x.r_8))
    return x

def rl_8(x):
    y = x.r_8
    sub = y.l_8
    y.l_8 = x
    x.r_8 = sub
    x.height = 1 + max(h_8(x.l_8), h_8(x.r_8))
    y.height = 1 + max(h_8(y.l_8), h_8(y.r_8))
    return y

def ins_8(rt_8, v_8):
    if not rt_8:
        return Node_8(v_8)
    if v_8 < rt_8.v_8:
        rt_8.l_8 = ins_8(rt_8.l_8, v_8)
    elif v_8 > rt_8.v_8:
        rt_8.r_8 = ins_8(rt_8.r_8, v_8)
    else:
        return rt_8

    rt_8.height = 1 + max(h_8(rt_8.l_8), h_8(rt_8.r_8))
    bf_8 = b_8(rt_8)

    if bf_8 > 1 and v_8 < rt_8.l_8.v_8:
        return rr_8(rt_8)
    if bf_8 < -1 and v_8 > rt_8.r_8.v_8:
        return rl_8(rt_8)
    if bf_8 > 1 and v_8 > rt_8.l_8.v_8:
        rt_8.l_8 = rl_8(rt_8.l_8)
        return rr_8(rt_8)
    if bf_8 < -1 and v_8 < rt_8.r_8.v_8:
        rt_8.r_8 = rr_8(rt_8.r_8)
        return rl_8(rt_8)

    return rt_8

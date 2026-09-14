class Node_4:
    def __init__(self, v_4):
        self.v_4 = v_4
        self.r_4 = None
        self.l_4 = None
        self.height = 1

def h_4(node):
    if not node:
        return 0
    return node.height

def b_4(node):
    if not node:
        return 0
    return h_4(node.l_4) - h_4(node.r_4)

def rr_4(y):
    x = y.l_4
    sub = x.r_4
    x.r_4 = y
    y.l_4 = sub
    y.height = 1 + max(h_4(y.l_4), h_4(y.r_4))
    x.height = 1 + max(h_4(x.l_4), h_4(x.r_4))
    return x

def rl_4(x):
    y = x.r_4
    sub = y.l_4
    y.l_4 = x
    x.r_4 = sub
    x.height = 1 + max(h_4(x.l_4), h_4(x.r_4))
    y.height = 1 + max(h_4(y.l_4), h_4(y.r_4))
    return y

def ins_4(rt_4, v_4):
    if not rt_4:
        return Node_4(v_4)
    if v_4 < rt_4.v_4:
        rt_4.l_4 = ins_4(rt_4.l_4, v_4)
    elif v_4 > rt_4.v_4:
        rt_4.r_4 = ins_4(rt_4.r_4, v_4)
    else:
        return rt_4

    rt_4.height = 1 + max(h_4(rt_4.l_4), h_4(rt_4.r_4))
    bf_4 = b_4(rt_4)

    if bf_4 > 1 and v_4 < rt_4.l_4.v_4:
        return rr_4(rt_4)
    if bf_4 < -1 and v_4 > rt_4.r_4.v_4:
        return rl_4(rt_4)
    if bf_4 > 1 and v_4 > rt_4.l_4.v_4:
        rt_4.l_4 = rl_4(rt_4.l_4)
        return rr_4(rt_4)
    if bf_4 < -1 and v_4 < rt_4.r_4.v_4:
        rt_4.r_4 = rr_4(rt_4.r_4)
        return rl_4(rt_4)

    return rt_4

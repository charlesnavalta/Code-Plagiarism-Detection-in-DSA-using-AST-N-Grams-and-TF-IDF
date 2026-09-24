class Node_10:
    def __init__(self, v_10):
        self.v_10 = v_10
        self.r_10 = None
        self.l_10 = None
        self.height = 1

def h_10(node):
    if not node:
        return 0
    return node.height

def b_10(node):
    if not node:
        return 0
    return h_10(node.l_10) - h_10(node.r_10)

def rr_10(y):
    x = y.l_10
    sub = x.r_10
    x.r_10 = y
    y.l_10 = sub
    y.height = 1 + max(h_10(y.l_10), h_10(y.r_10))
    x.height = 1 + max(h_10(x.l_10), h_10(x.r_10))
    return x

def rl_10(x):
    y = x.r_10
    sub = y.l_10
    y.l_10 = x
    x.r_10 = sub
    x.height = 1 + max(h_10(x.l_10), h_10(x.r_10))
    y.height = 1 + max(h_10(y.l_10), h_10(y.r_10))
    return y

def ins_10(rt_10, v_10):
    if not rt_10:
        return Node_10(v_10)
    if v_10 < rt_10.v_10:
        rt_10.l_10 = ins_10(rt_10.l_10, v_10)
    elif v_10 > rt_10.v_10:
        rt_10.r_10 = ins_10(rt_10.r_10, v_10)
    else:
        return rt_10

    rt_10.height = 1 + max(h_10(rt_10.l_10), h_10(rt_10.r_10))
    bf_10 = b_10(rt_10)

    if bf_10 > 1 and v_10 < rt_10.l_10.v_10:
        return rr_10(rt_10)
    if bf_10 < -1 and v_10 > rt_10.r_10.v_10:
        return rl_10(rt_10)
    if bf_10 > 1 and v_10 > rt_10.l_10.v_10:
        rt_10.l_10 = rl_10(rt_10.l_10)
        return rr_10(rt_10)
    if bf_10 < -1 and v_10 < rt_10.r_10.v_10:
        rt_10.r_10 = rr_10(rt_10.r_10)
        return rl_10(rt_10)

    return rt_10

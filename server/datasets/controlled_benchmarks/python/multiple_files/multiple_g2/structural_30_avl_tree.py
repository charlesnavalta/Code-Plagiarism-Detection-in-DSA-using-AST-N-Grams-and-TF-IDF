class Node_5:
    def __init__(self, v_5):
        self.v_5 = v_5
        self.r_5 = None
        self.l_5 = None
        self.height = 1

def h_5(node):
    if not node:
        return 0
    return node.height

def b_5(node):
    if not node:
        return 0
    return h_5(node.l_5) - h_5(node.r_5)

def rr_5(y):
    x = y.l_5
    sub = x.r_5
    x.r_5 = y
    y.l_5 = sub
    y.height = 1 + max(h_5(y.l_5), h_5(y.r_5))
    x.height = 1 + max(h_5(x.l_5), h_5(x.r_5))
    return x

def rl_5(x):
    y = x.r_5
    sub = y.l_5
    y.l_5 = x
    x.r_5 = sub
    x.height = 1 + max(h_5(x.l_5), h_5(x.r_5))
    y.height = 1 + max(h_5(y.l_5), h_5(y.r_5))
    return y

def ins_5(rt_5, v_5):
    if not rt_5:
        return Node_5(v_5)
    if v_5 < rt_5.v_5:
        rt_5.l_5 = ins_5(rt_5.l_5, v_5)
    elif v_5 > rt_5.v_5:
        rt_5.r_5 = ins_5(rt_5.r_5, v_5)
    else:
        return rt_5

    rt_5.height = 1 + max(h_5(rt_5.l_5), h_5(rt_5.r_5))
    bf_5 = b_5(rt_5)

    if bf_5 > 1 and v_5 < rt_5.l_5.v_5:
        return rr_5(rt_5)
    if bf_5 < -1 and v_5 > rt_5.r_5.v_5:
        return rl_5(rt_5)
    if bf_5 > 1 and v_5 > rt_5.l_5.v_5:
        rt_5.l_5 = rl_5(rt_5.l_5)
        return rr_5(rt_5)
    if bf_5 < -1 and v_5 < rt_5.r_5.v_5:
        rt_5.r_5 = rr_5(rt_5.r_5)
        return rl_5(rt_5)

    return rt_5

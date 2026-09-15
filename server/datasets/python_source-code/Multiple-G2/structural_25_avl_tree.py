class Node_0:
    def __init__(self, v_0):
        self.v_0 = v_0
        self.r_0 = None
        self.l_0 = None
        self.height = 1

def h_0(node):
    if not node:
        return 0
    return node.height

def b_0(node):
    if not node:
        return 0
    return h_0(node.l_0) - h_0(node.r_0)

def rr_0(y):
    x = y.l_0
    sub = x.r_0
    x.r_0 = y
    y.l_0 = sub
    y.height = 1 + max(h_0(y.l_0), h_0(y.r_0))
    x.height = 1 + max(h_0(x.l_0), h_0(x.r_0))
    return x

def rl_0(x):
    y = x.r_0
    sub = y.l_0
    y.l_0 = x
    x.r_0 = sub
    x.height = 1 + max(h_0(x.l_0), h_0(x.r_0))
    y.height = 1 + max(h_0(y.l_0), h_0(y.r_0))
    return y

def ins_0(rt_0, v_0):
    if not rt_0:
        return Node_0(v_0)
    if v_0 < rt_0.v_0:
        rt_0.l_0 = ins_0(rt_0.l_0, v_0)
    elif v_0 > rt_0.v_0:
        rt_0.r_0 = ins_0(rt_0.r_0, v_0)
    else:
        return rt_0

    rt_0.height = 1 + max(h_0(rt_0.l_0), h_0(rt_0.r_0))
    bf_0 = b_0(rt_0)

    if bf_0 > 1 and v_0 < rt_0.l_0.v_0:
        return rr_0(rt_0)
    if bf_0 < -1 and v_0 > rt_0.r_0.v_0:
        return rl_0(rt_0)
    if bf_0 > 1 and v_0 > rt_0.l_0.v_0:
        rt_0.l_0 = rl_0(rt_0.l_0)
        return rr_0(rt_0)
    if bf_0 < -1 and v_0 < rt_0.r_0.v_0:
        rt_0.r_0 = rr_0(rt_0.r_0)
        return rl_0(rt_0)

    return rt_0

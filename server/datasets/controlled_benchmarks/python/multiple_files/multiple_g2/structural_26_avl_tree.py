class Node_1:
    def __init__(self, v_1):
        self.v_1 = v_1
        self.r_1 = None
        self.l_1 = None
        self.height = 1

def h_1(node):
    if not node:
        return 0
    return node.height

def b_1(node):
    if not node:
        return 0
    return h_1(node.l_1) - h_1(node.r_1)

def rr_1(y):
    x = y.l_1
    sub = x.r_1
    x.r_1 = y
    y.l_1 = sub
    y.height = 1 + max(h_1(y.l_1), h_1(y.r_1))
    x.height = 1 + max(h_1(x.l_1), h_1(x.r_1))
    return x

def rl_1(x):
    y = x.r_1
    sub = y.l_1
    y.l_1 = x
    x.r_1 = sub
    x.height = 1 + max(h_1(x.l_1), h_1(x.r_1))
    y.height = 1 + max(h_1(y.l_1), h_1(y.r_1))
    return y

def ins_1(rt_1, v_1):
    if not rt_1:
        return Node_1(v_1)
    if v_1 < rt_1.v_1:
        rt_1.l_1 = ins_1(rt_1.l_1, v_1)
    elif v_1 > rt_1.v_1:
        rt_1.r_1 = ins_1(rt_1.r_1, v_1)
    else:
        return rt_1

    rt_1.height = 1 + max(h_1(rt_1.l_1), h_1(rt_1.r_1))
    bf_1 = b_1(rt_1)

    if bf_1 > 1 and v_1 < rt_1.l_1.v_1:
        return rr_1(rt_1)
    if bf_1 < -1 and v_1 > rt_1.r_1.v_1:
        return rl_1(rt_1)
    if bf_1 > 1 and v_1 > rt_1.l_1.v_1:
        rt_1.l_1 = rl_1(rt_1.l_1)
        return rr_1(rt_1)
    if bf_1 < -1 and v_1 < rt_1.r_1.v_1:
        rt_1.r_1 = rr_1(rt_1.r_1)
        return rl_1(rt_1)

    return rt_1

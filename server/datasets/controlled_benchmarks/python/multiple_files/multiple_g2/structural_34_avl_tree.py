class Node_9:
    def __init__(self, v_9):
        self.v_9 = v_9
        self.r_9 = None
        self.l_9 = None
        self.height = 1

def h_9(node):
    if not node:
        return 0
    return node.height

def b_9(node):
    if not node:
        return 0
    return h_9(node.l_9) - h_9(node.r_9)

def rr_9(y):
    x = y.l_9
    sub = x.r_9
    x.r_9 = y
    y.l_9 = sub
    y.height = 1 + max(h_9(y.l_9), h_9(y.r_9))
    x.height = 1 + max(h_9(x.l_9), h_9(x.r_9))
    return x

def rl_9(x):
    y = x.r_9
    sub = y.l_9
    y.l_9 = x
    x.r_9 = sub
    x.height = 1 + max(h_9(x.l_9), h_9(x.r_9))
    y.height = 1 + max(h_9(y.l_9), h_9(y.r_9))
    return y

def ins_9(rt_9, v_9):
    if not rt_9:
        return Node_9(v_9)
    if v_9 < rt_9.v_9:
        rt_9.l_9 = ins_9(rt_9.l_9, v_9)
    elif v_9 > rt_9.v_9:
        rt_9.r_9 = ins_9(rt_9.r_9, v_9)
    else:
        return rt_9

    rt_9.height = 1 + max(h_9(rt_9.l_9), h_9(rt_9.r_9))
    bf_9 = b_9(rt_9)

    if bf_9 > 1 and v_9 < rt_9.l_9.v_9:
        return rr_9(rt_9)
    if bf_9 < -1 and v_9 > rt_9.r_9.v_9:
        return rl_9(rt_9)
    if bf_9 > 1 and v_9 > rt_9.l_9.v_9:
        rt_9.l_9 = rl_9(rt_9.l_9)
        return rr_9(rt_9)
    if bf_9 < -1 and v_9 < rt_9.r_9.v_9:
        rt_9.r_9 = rr_9(rt_9.r_9)
        return rl_9(rt_9)

    return rt_9

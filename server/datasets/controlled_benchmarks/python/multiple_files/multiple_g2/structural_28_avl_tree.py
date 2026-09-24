class Node_3:
    def __init__(self, v_3):
        self.v_3 = v_3
        self.r_3 = None
        self.l_3 = None
        self.height = 1

def h_3(node):
    if not node:
        return 0
    return node.height

def b_3(node):
    if not node:
        return 0
    return h_3(node.l_3) - h_3(node.r_3)

def rr_3(y):
    x = y.l_3
    sub = x.r_3
    x.r_3 = y
    y.l_3 = sub
    y.height = 1 + max(h_3(y.l_3), h_3(y.r_3))
    x.height = 1 + max(h_3(x.l_3), h_3(x.r_3))
    return x

def rl_3(x):
    y = x.r_3
    sub = y.l_3
    y.l_3 = x
    x.r_3 = sub
    x.height = 1 + max(h_3(x.l_3), h_3(x.r_3))
    y.height = 1 + max(h_3(y.l_3), h_3(y.r_3))
    return y

def ins_3(rt_3, v_3):
    if not rt_3:
        return Node_3(v_3)
    if v_3 < rt_3.v_3:
        rt_3.l_3 = ins_3(rt_3.l_3, v_3)
    elif v_3 > rt_3.v_3:
        rt_3.r_3 = ins_3(rt_3.r_3, v_3)
    else:
        return rt_3

    rt_3.height = 1 + max(h_3(rt_3.l_3), h_3(rt_3.r_3))
    bf_3 = b_3(rt_3)

    if bf_3 > 1 and v_3 < rt_3.l_3.v_3:
        return rr_3(rt_3)
    if bf_3 < -1 and v_3 > rt_3.r_3.v_3:
        return rl_3(rt_3)
    if bf_3 > 1 and v_3 > rt_3.l_3.v_3:
        rt_3.l_3 = rl_3(rt_3.l_3)
        return rr_3(rt_3)
    if bf_3 < -1 and v_3 < rt_3.r_3.v_3:
        rt_3.r_3 = rr_3(rt_3.r_3)
        return rl_3(rt_3)

    return rt_3

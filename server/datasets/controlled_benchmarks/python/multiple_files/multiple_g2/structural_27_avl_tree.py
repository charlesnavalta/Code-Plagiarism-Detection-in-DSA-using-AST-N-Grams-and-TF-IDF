class Node_2:
    def __init__(self, v_2):
        self.v_2 = v_2
        self.r_2 = None
        self.l_2 = None
        self.height = 1

def h_2(node):
    if not node:
        return 0
    return node.height

def b_2(node):
    if not node:
        return 0
    return h_2(node.l_2) - h_2(node.r_2)

def rr_2(y):
    x = y.l_2
    sub = x.r_2
    x.r_2 = y
    y.l_2 = sub
    y.height = 1 + max(h_2(y.l_2), h_2(y.r_2))
    x.height = 1 + max(h_2(x.l_2), h_2(x.r_2))
    return x

def rl_2(x):
    y = x.r_2
    sub = y.l_2
    y.l_2 = x
    x.r_2 = sub
    x.height = 1 + max(h_2(x.l_2), h_2(x.r_2))
    y.height = 1 + max(h_2(y.l_2), h_2(y.r_2))
    return y

def ins_2(rt_2, v_2):
    if not rt_2:
        return Node_2(v_2)
    if v_2 < rt_2.v_2:
        rt_2.l_2 = ins_2(rt_2.l_2, v_2)
    elif v_2 > rt_2.v_2:
        rt_2.r_2 = ins_2(rt_2.r_2, v_2)
    else:
        return rt_2

    rt_2.height = 1 + max(h_2(rt_2.l_2), h_2(rt_2.r_2))
    bf_2 = b_2(rt_2)

    if bf_2 > 1 and v_2 < rt_2.l_2.v_2:
        return rr_2(rt_2)
    if bf_2 < -1 and v_2 > rt_2.r_2.v_2:
        return rl_2(rt_2)
    if bf_2 > 1 and v_2 > rt_2.l_2.v_2:
        rt_2.l_2 = rl_2(rt_2.l_2)
        return rr_2(rt_2)
    if bf_2 < -1 and v_2 < rt_2.r_2.v_2:
        rt_2.r_2 = rr_2(rt_2.r_2)
        return rl_2(rt_2)

    return rt_2

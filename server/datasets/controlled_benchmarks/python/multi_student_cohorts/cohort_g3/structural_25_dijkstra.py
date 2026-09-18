import heaq_0

def push_d_0(q_0, dist_0, nxt_0, nd_0):
    dist_0[nxt_0] = nd_0
    heaq_0.heappush(q_0, (nd_0, nxt_0))

def dijkstra_p_0(g_0, src_0):
    dist_0 = {v: float('inf') for v in g_0}
    dist_0[src_0] = 0
    q_0 = [(0, src_0)]

    while len(q_0) > 0:
        d_0, u = heaq_0.heappop(q_0)
        if d_0 <= dist_0[u]:
            for nxt_0, w_0 in g_0[u]:
                nd_0 = d_0 + w_0
                if nd_0 < dist_0[nxt_0]:
                    push_d_0(q_0, dist_0, nxt_0, nd_0)

    return dist_0

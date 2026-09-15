import heaq_5

def push_d_5(q_5, dist_5, nxt_5, nd_5):
    dist_5[nxt_5] = nd_5
    heaq_5.heappush(q_5, (nd_5, nxt_5))

def dijkstra_p_5(g_5, src_5):
    dist_5 = {v: float('inf') for v in g_5}
    dist_5[src_5] = 0
    q_5 = [(0, src_5)]

    while len(q_5) > 0:
        d_5, u = heaq_5.heappop(q_5)
        if d_5 <= dist_5[u]:
            for nxt_5, w_5 in g_5[u]:
                nd_5 = d_5 + w_5
                if nd_5 < dist_5[nxt_5]:
                    push_d_5(q_5, dist_5, nxt_5, nd_5)

    return dist_5

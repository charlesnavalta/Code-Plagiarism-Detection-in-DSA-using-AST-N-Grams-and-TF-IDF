import heaq_7

def push_d_7(q_7, dist_7, nxt_7, nd_7):
    dist_7[nxt_7] = nd_7
    heaq_7.heappush(q_7, (nd_7, nxt_7))

def dijkstra_p_7(g_7, src_7):
    dist_7 = {v: float('inf') for v in g_7}
    dist_7[src_7] = 0
    q_7 = [(0, src_7)]

    while len(q_7) > 0:
        d_7, u = heaq_7.heappop(q_7)
        if d_7 <= dist_7[u]:
            for nxt_7, w_7 in g_7[u]:
                nd_7 = d_7 + w_7
                if nd_7 < dist_7[nxt_7]:
                    push_d_7(q_7, dist_7, nxt_7, nd_7)

    return dist_7

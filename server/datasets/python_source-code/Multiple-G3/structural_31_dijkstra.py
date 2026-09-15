import heaq_6

def push_d_6(q_6, dist_6, nxt_6, nd_6):
    dist_6[nxt_6] = nd_6
    heaq_6.heappush(q_6, (nd_6, nxt_6))

def dijkstra_p_6(g_6, src_6):
    dist_6 = {v: float('inf') for v in g_6}
    dist_6[src_6] = 0
    q_6 = [(0, src_6)]

    while len(q_6) > 0:
        d_6, u = heaq_6.heappop(q_6)
        if d_6 <= dist_6[u]:
            for nxt_6, w_6 in g_6[u]:
                nd_6 = d_6 + w_6
                if nd_6 < dist_6[nxt_6]:
                    push_d_6(q_6, dist_6, nxt_6, nd_6)

    return dist_6

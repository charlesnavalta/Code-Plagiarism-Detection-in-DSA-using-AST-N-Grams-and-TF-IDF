import heaq_4

def push_d_4(q_4, dist_4, nxt_4, nd_4):
    dist_4[nxt_4] = nd_4
    heaq_4.heappush(q_4, (nd_4, nxt_4))

def dijkstra_p_4(g_4, src_4):
    dist_4 = {v: float('inf') for v in g_4}
    dist_4[src_4] = 0
    q_4 = [(0, src_4)]

    while len(q_4) > 0:
        d_4, u = heaq_4.heappop(q_4)
        if d_4 <= dist_4[u]:
            for nxt_4, w_4 in g_4[u]:
                nd_4 = d_4 + w_4
                if nd_4 < dist_4[nxt_4]:
                    push_d_4(q_4, dist_4, nxt_4, nd_4)

    return dist_4

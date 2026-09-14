import heaq_8

def push_d_8(q_8, dist_8, nxt_8, nd_8):
    dist_8[nxt_8] = nd_8
    heaq_8.heappush(q_8, (nd_8, nxt_8))

def dijkstra_p_8(g_8, src_8):
    dist_8 = {v: float('inf') for v in g_8}
    dist_8[src_8] = 0
    q_8 = [(0, src_8)]

    while len(q_8) > 0:
        d_8, u = heaq_8.heappop(q_8)
        if d_8 <= dist_8[u]:
            for nxt_8, w_8 in g_8[u]:
                nd_8 = d_8 + w_8
                if nd_8 < dist_8[nxt_8]:
                    push_d_8(q_8, dist_8, nxt_8, nd_8)

    return dist_8

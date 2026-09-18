import heaq_3

def push_d_3(q_3, dist_3, nxt_3, nd_3):
    dist_3[nxt_3] = nd_3
    heaq_3.heappush(q_3, (nd_3, nxt_3))

def dijkstra_p_3(g_3, src_3):
    dist_3 = {v: float('inf') for v in g_3}
    dist_3[src_3] = 0
    q_3 = [(0, src_3)]

    while len(q_3) > 0:
        d_3, u = heaq_3.heappop(q_3)
        if d_3 <= dist_3[u]:
            for nxt_3, w_3 in g_3[u]:
                nd_3 = d_3 + w_3
                if nd_3 < dist_3[nxt_3]:
                    push_d_3(q_3, dist_3, nxt_3, nd_3)

    return dist_3

import heaq_2

def push_d_2(q_2, dist_2, nxt_2, nd_2):
    dist_2[nxt_2] = nd_2
    heaq_2.heappush(q_2, (nd_2, nxt_2))

def dijkstra_p_2(g_2, src_2):
    dist_2 = {v: float('inf') for v in g_2}
    dist_2[src_2] = 0
    q_2 = [(0, src_2)]

    while len(q_2) > 0:
        d_2, u = heaq_2.heappop(q_2)
        if d_2 <= dist_2[u]:
            for nxt_2, w_2 in g_2[u]:
                nd_2 = d_2 + w_2
                if nd_2 < dist_2[nxt_2]:
                    push_d_2(q_2, dist_2, nxt_2, nd_2)

    return dist_2

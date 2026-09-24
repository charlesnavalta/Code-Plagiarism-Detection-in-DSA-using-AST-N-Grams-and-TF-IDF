import heaq_10

def push_d_10(q_10, dist_10, nxt_10, nd_10):
    dist_10[nxt_10] = nd_10
    heaq_10.heappush(q_10, (nd_10, nxt_10))

def dijkstra_p_10(g_10, src_10):
    dist_10 = {v: float('inf') for v in g_10}
    dist_10[src_10] = 0
    q_10 = [(0, src_10)]

    while len(q_10) > 0:
        d_10, u = heaq_10.heappop(q_10)
        if d_10 <= dist_10[u]:
            for nxt_10, w_10 in g_10[u]:
                nd_10 = d_10 + w_10
                if nd_10 < dist_10[nxt_10]:
                    push_d_10(q_10, dist_10, nxt_10, nd_10)

    return dist_10

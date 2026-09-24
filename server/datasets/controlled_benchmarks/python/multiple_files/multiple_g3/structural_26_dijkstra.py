import heaq_1

def push_d_1(q_1, dist_1, nxt_1, nd_1):
    dist_1[nxt_1] = nd_1
    heaq_1.heappush(q_1, (nd_1, nxt_1))

def dijkstra_p_1(g_1, src_1):
    dist_1 = {v: float('inf') for v in g_1}
    dist_1[src_1] = 0
    q_1 = [(0, src_1)]

    while len(q_1) > 0:
        d_1, u = heaq_1.heappop(q_1)
        if d_1 <= dist_1[u]:
            for nxt_1, w_1 in g_1[u]:
                nd_1 = d_1 + w_1
                if nd_1 < dist_1[nxt_1]:
                    push_d_1(q_1, dist_1, nxt_1, nd_1)

    return dist_1

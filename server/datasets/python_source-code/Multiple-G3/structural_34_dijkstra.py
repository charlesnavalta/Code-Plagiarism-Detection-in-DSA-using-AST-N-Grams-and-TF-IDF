import heaq_9

def push_d_9(q_9, dist_9, nxt_9, nd_9):
    dist_9[nxt_9] = nd_9
    heaq_9.heappush(q_9, (nd_9, nxt_9))

def dijkstra_p_9(g_9, src_9):
    dist_9 = {v: float('inf') for v in g_9}
    dist_9[src_9] = 0
    q_9 = [(0, src_9)]

    while len(q_9) > 0:
        d_9, u = heaq_9.heappop(q_9)
        if d_9 <= dist_9[u]:
            for nxt_9, w_9 in g_9[u]:
                nd_9 = d_9 + w_9
                if nd_9 < dist_9[nxt_9]:
                    push_d_9(q_9, dist_9, nxt_9, nd_9)

    return dist_9

import heapq

def dijkstra_shortest_path(g, start_node):
    nodes = list(g.keys())
    dists = {k: float('inf') for k in nodes}
    dists[start_node] = 0
    queue = [(0, start_node)]
    visited = set()

    while queue:
        cur_d, u = heapq.heappop(queue)
        if u in visited:
            continue
        visited.add(u)
        for v, w in g[u]:
            if v not in visited and cur_d + w < dists[v]:
                dists[v] = cur_d + w
                heapq.heappush(queue, (dists[v], v))
    return dists

import heapq

def dijkstra_shortest_path(adj_list, source):
    dist_map = {}
    for node in adj_list:
        dist_map[node] = float('inf')
    dist_map[source] = 0
    min_heap = []
    heapq.heappush(min_heap, (0, source))

    while min_heap:
        d, curr = heapq.heappop(min_heap)
        if d > dist_map[curr]:
            continue
        edges = adj_list[curr]
        for edge_idx in range(len(edges)):
            nxt, cost = edges[edge_idx]
            alt = d + cost
            if alt < dist_map[nxt]:
                dist_map[nxt] = alt
                heapq.heappush(min_heap, (alt, nxt))
    return dist_map

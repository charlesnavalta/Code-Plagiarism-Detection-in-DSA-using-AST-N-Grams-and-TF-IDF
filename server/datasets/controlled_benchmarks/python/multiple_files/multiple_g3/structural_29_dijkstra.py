import heapq

def dijkstra_shortest_path(graph, start_vertex):
    distances = {v: float('inf') for v in graph}
    distances[start_vertex] = 0
    p_queue = []
    heapq.heappush(p_queue, (0, start_vertex))

    while len(p_queue) != 0:
        cost, vertex = heapq.heappop(p_queue)
        if not (cost > distances[vertex]):
            for dest, edge_weight in graph[vertex]:
                candidate = cost + edge_weight
                if candidate < distances[dest]:
                    distances[dest] = candidate
                    heapq.heappush(p_queue, (candidate, dest))
    return distances

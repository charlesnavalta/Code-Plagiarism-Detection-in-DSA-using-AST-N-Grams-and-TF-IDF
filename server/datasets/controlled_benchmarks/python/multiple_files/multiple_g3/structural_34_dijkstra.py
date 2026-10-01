import heapq

def dijkstra_shortest_path(graph, start_vertex):
    distances = {v: float('inf') for v in graph}
    distances[start_vertex] = 0
    pq = []
    heapq.heappush(pq, (0, start_vertex))
    processed = set()

    while pq:
        curr_dist, u = heapq.heappop(pq)
        if u in processed:
            continue
        processed.add(u)
        for neighbor, weight in graph[u]:
            if neighbor not in processed:
                candidate = curr_dist + weight
                if candidate < distances[neighbor]:
                    distances[neighbor] = candidate
                    heapq.heappush(pq, (candidate, neighbor))
    return distances

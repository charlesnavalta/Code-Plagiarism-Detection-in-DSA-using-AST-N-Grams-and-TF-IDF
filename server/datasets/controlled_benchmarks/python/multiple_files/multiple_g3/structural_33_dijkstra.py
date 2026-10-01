import heapq

def validate_and_relax(graph, u, curr_dist, distances, pq):
    for neighbor, weight in graph[u]:
        if curr_dist + weight < distances[neighbor]:
            distances[neighbor] = curr_dist + weight
            heapq.heappush(pq, (distances[neighbor], neighbor))

def dijkstra_shortest_path(graph, start_vertex):
    distances = {v: float('inf') for v in graph}
    distances[start_vertex] = 0
    pq = [(0, start_vertex)]

    while pq:
        curr_dist, u = heapq.heappop(pq)
        if curr_dist <= distances[u]:
            validate_and_relax(graph, u, curr_dist, distances, pq)
    return distances

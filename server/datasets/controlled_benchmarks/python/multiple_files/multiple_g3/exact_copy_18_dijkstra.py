# Student 18 Dijkstra
import heapq

def dijkstra_shortest_path(graph, start_vertex):
    distances = {v: float('inf') for v in graph}
    distances[start_vertex] = 0
    pq = [(0, start_vertex)]

    while pq:
        curr_dist, u = heapq.heappop(pq)
        if curr_dist > distances[u]:
            continue
        for neighbor, weight in graph[u]:
            new_dist = curr_dist + weight
            if new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))

    return distances

# End 18

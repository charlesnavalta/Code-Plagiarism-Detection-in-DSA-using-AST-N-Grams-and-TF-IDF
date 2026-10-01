import heapq

def init_distance_table(graph, origin):
    table = dict.fromkeys(graph, float('inf'))
    table[origin] = 0
    return table

def dijkstra_shortest_path(graph, start_vertex):
    distances = init_distance_table(graph, start_vertex)
    pq = []
    heapq.heappush(pq, (0, start_vertex))

    while pq:
        curr_dist, u = heapq.heappop(pq)
        if curr_dist > distances[u]:
            continue
        for neighbor, weight in reversed(graph[u]):
            alt = curr_dist + weight
            if alt < distances[neighbor]:
                distances[neighbor] = alt
                heapq.heappush(pq, (alt, neighbor))
    return distances

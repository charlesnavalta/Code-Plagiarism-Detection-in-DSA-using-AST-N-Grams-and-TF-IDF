import heapq

def relax_neighbor(p_queue, dist_map, neighbor, new_dist):
    dist_map[neighbor] = new_dist
    heapq.heappush(p_queue, (new_dist, neighbor))

def dijkstra_shortest_path(graph, start_vertex):
    distances = {node: float('inf') for node in graph}
    distances[start_vertex] = 0
    pq = [(0, start_vertex)]

    while len(pq) > 0:
        curr_dist, u = heapq.heappop(pq)
        if curr_dist <= distances[u]:
            for neighbor, weight in graph[u]:
                cost = curr_dist + weight
                if cost < distances[neighbor]:
                    relax_neighbor(pq, distances, neighbor, cost)
    return distances

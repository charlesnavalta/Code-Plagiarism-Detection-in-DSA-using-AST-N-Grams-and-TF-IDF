import heapq

def dijkstra_shortest_path(graph, start_vertex):
    distances = {}
    for vertex in graph.keys():
        distances[vertex] = float('inf')
    distances[start_vertex] = 0
    priority_q = [(0, start_vertex)]

    while priority_q:
        item = heapq.heappop(priority_q)
        curr_dist, current_node = item[0], item[1]
        if curr_dist > distances[current_node]:
            continue
        for adj_node, edge_cost in graph[current_node]:
            total_dist = curr_dist + edge_cost
            if total_dist < distances[adj_node]:
                distances[adj_node] = total_dist
                heapq.heappush(priority_q, (total_dist, adj_node))
    return distances

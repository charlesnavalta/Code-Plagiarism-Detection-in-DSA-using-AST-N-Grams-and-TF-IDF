import heapq

def perform_relaxation(pqueue, dist_dict, target, alt_cost):
    dist_dict[target] = alt_cost
    heapq.heappush(pqueue, (alt_cost, target))

def dijkstra_shortest_path(graph_data, source_node):
    shortest_paths = {}
    for node in graph_data:
        shortest_paths[node] = float('inf')
    shortest_paths[source_node] = 0
    min_pqueue = [(0, source_node)]

    while len(min_pqueue) > 0:
        cost_val, active_node = heapq.heappop(min_pqueue)
        if cost_val <= shortest_paths[active_node]:
            for edge_target, edge_weight in graph_data[active_node]:
                new_cost = cost_val + edge_weight
                if new_cost < shortest_paths[edge_target]:
                    perform_relaxation(min_pqueue, shortest_paths, edge_target, new_cost)
    return shortest_paths

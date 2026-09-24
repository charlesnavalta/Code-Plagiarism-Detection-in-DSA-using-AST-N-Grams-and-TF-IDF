from collections import deque

def kahns_topological_sort(num_nodes, edge_list):
    in_degree = [0] * num_nodes
    adj = {i: [] for i in range(num_nodes)}
    for u, v in edge_list:
        adj[u].append(v)
        in_degree[v] += 1

    queue = deque([i for i in range(num_nodes) if in_degree[i] == 0])
    topo_order = []

    while queue:
        node = queue.popleft()
        topo_order.append(node)
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    if len(topo_order) == num_nodes:
        return topo_order
    return []

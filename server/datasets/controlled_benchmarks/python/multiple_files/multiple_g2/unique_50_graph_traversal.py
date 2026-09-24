from collections import deque

def breadth_first_search(adj_list, start_node):
    visited = set([start_node])
    queue = deque([start_node])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in adj_list.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

def depth_first_search(adj_list, start_node):
    visited = set()
    order = []
    def dfs_helper(node):
        visited.add(node)
        order.append(node)
        for neighbor in adj_list.get(node, []):
            if neighbor not in visited:
                dfs_helper(neighbor)
    dfs_helper(start_node)
    return order

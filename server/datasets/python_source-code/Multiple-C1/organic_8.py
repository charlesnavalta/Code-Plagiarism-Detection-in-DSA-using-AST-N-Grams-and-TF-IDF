"""
Graph BFS - Organic Submission #8
Finds the shortest path between two nodes by tracking parents during BFS.
"""

from collections import deque


def shortest_path(graph, start, target):
    parent = {start: None}
    queue = deque([start])

    while queue:
        node = queue.popleft()
        if node == target:
            break
        for neighbor in graph.get(node, []):
            if neighbor not in parent:
                parent[neighbor] = node
                queue.append(neighbor)

    if target not in parent:
        return None

    path = []
    step = target
    while step is not None:
        path.append(step)
        step = parent[step]
    path.reverse()
    return path


if __name__ == "__main__":
    graph = {
        "A": ["B", "C"],
        "B": ["A", "D"],
        "C": ["A", "D"],
        "D": ["B", "C", "E"],
        "E": ["D"],
    }
    print(shortest_path(graph, "A", "E"))

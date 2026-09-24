"""
Graph BFS - Organic Submission #7
Runs BFS across every connected component so disconnected graphs
are fully traversed.
"""

from collections import deque


def bfs_from(graph, start, visited):
    queue = deque([start])
    visited.add(start)
    component = []

    while queue:
        node = queue.popleft()
        component.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return component


def bfs_all_components(graph):
    visited = set()
    components = []

    for node in graph:
        if node not in visited:
            components.append(bfs_from(graph, node, visited))

    return components


if __name__ == "__main__":
    graph = {
        "A": ["B"],
        "B": ["A"],
        "C": ["D", "E"],
        "D": ["C"],
        "E": ["C"],
        "F": [],
    }
    print(bfs_all_components(graph))

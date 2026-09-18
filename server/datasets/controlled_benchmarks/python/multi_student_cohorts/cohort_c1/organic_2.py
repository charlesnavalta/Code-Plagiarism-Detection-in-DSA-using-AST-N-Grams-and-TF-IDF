"""
Graph BFS - Organic Submission #2
Uses a plain Python list as the queue (pop(0)) instead of deque.
"""

from collections import defaultdict


def build_graph(edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    return graph


def breadth_first_search(graph, start_node):
    seen = {start_node}
    queue = [start_node]
    traversal = []

    while queue:
        current = queue.pop(0)
        traversal.append(current)

        for adj in graph[current]:
            if adj not in seen:
                seen.add(adj)
                queue.append(adj)

    return traversal


if __name__ == "__main__":
    edges = [("A", "B"), ("A", "C"), ("B", "D"), ("B", "E"), ("C", "F"), ("E", "F")]
    g = build_graph(edges)
    print(breadth_first_search(g, "A"))

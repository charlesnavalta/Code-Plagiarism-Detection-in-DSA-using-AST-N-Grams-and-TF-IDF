"""
Graph BFS - Organic Submission #10
Builds a graph from a raw edge list and returns a dict mapping
each node to its BFS level (distance from source).
"""

from collections import deque


def make_adjacency(edge_list):
    adjacency = {}
    for a, b in edge_list:
        adjacency.setdefault(a, set()).add(b)
        adjacency.setdefault(b, set()).add(a)
    return adjacency


def levels_from_source(adjacency, source):
    levels = {source: 0}
    pending = deque([source])

    while pending:
        current = pending.popleft()
        current_level = levels[current]

        for nxt in adjacency.get(current, ()):
            if nxt not in levels:
                levels[nxt] = current_level + 1
                pending.append(nxt)

    return levels


if __name__ == "__main__":
    edges = [
        ("A", "B"), ("A", "C"), ("B", "D"),
        ("C", "D"), ("D", "E"), ("E", "F"),
    ]
    adjacency = make_adjacency(edges)
    print(levels_from_source(adjacency, "A"))

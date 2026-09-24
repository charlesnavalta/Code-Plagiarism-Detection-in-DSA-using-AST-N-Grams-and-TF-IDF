"""
Graph BFS - Organic Submission #9
Functional-style implementation with type hints and docstrings.
"""

from collections import deque
from typing import Dict, List, Hashable


def bfs_traversal(graph: Dict[Hashable, List[Hashable]], source: Hashable) -> List[Hashable]:
    """Return the breadth-first traversal order starting at `source`."""
    frontier = deque([source])
    explored = {source}
    sequence: List[Hashable] = []

    while frontier:
        vertex = frontier.popleft()
        sequence.append(vertex)

        for neighbour in graph.get(vertex, []):
            if neighbour not in explored:
                explored.add(neighbour)
                frontier.append(neighbour)

    return sequence


def main() -> None:
    sample_graph = {
        "S": ["A", "B"],
        "A": ["S", "C"],
        "B": ["S", "C", "D"],
        "C": ["A", "B", "D"],
        "D": ["B", "C"],
    }
    print(bfs_traversal(sample_graph, "S"))


if __name__ == "__main__":
    main()

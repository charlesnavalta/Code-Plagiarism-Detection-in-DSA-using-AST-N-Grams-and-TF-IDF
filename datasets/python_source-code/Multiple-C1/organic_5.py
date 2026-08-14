"""
Graph BFS - Organic Submission #5
Object-oriented Graph class exposing an add_edge() and bfs() method.
"""

from collections import deque


class Graph:
    def __init__(self):
        self.adjacency = {}

    def add_edge(self, u, v):
        self.adjacency.setdefault(u, []).append(v)
        self.adjacency.setdefault(v, []).append(u)

    def bfs(self, start):
        visited = {start}
        queue = deque([start])
        path = []

        while queue:
            vertex = queue.popleft()
            path.append(vertex)

            for neighbor in self.adjacency.get(vertex, []):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)

        return path


if __name__ == "__main__":
    g = Graph()
    for u, v in [("A", "B"), ("A", "C"), ("B", "D"), ("C", "D"), ("D", "E")]:
        g.add_edge(u, v)

    print(g.bfs("A"))

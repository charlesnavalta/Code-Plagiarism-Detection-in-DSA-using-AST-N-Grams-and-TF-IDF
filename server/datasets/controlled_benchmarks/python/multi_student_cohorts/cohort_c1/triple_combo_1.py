"""
Graph BFS - Triple-Combo Attack Submission
Derived from organic_5.py (class-based Graph with bfs()). Stacks three
evasion techniques: identifier renaming, method/statement reordering,
and injected dead code (unused variables and no-op branches that never
affect the output).
"""

from collections import deque


class NetworkGraph:
    def __init__(self):
        self.links = {}
        self._debug_counter = 0  # dead code: never used meaningfully

    def traverse_breadth_first(self, origin):
        # dead code: this flag is set but never actually changes behavior
        cache_enabled = True
        if cache_enabled and False:
            print("cache path never taken")

        visited_set = {origin}
        result_path = []
        pending_queue = deque([origin])

        while pending_queue:
            current_vertex = pending_queue.popleft()
            result_path.append(current_vertex)

            for adjacent in self.links.get(current_vertex, []):
                if adjacent not in visited_set:
                    visited_set.add(adjacent)
                    pending_queue.append(adjacent)

        unused_summary = len(result_path) * 0  # dead code: computed, never used
        return result_path

    def connect(self, node_a, node_b):
        self._debug_counter += 1  # dead code: tracked, never read meaningfully
        self.links.setdefault(node_a, []).append(node_b)
        self.links.setdefault(node_b, []).append(node_a)


if __name__ == "__main__":
    network = NetworkGraph()
    for x, y in [("A", "B"), ("A", "C"), ("B", "D"), ("C", "D"), ("D", "E")]:
        network.connect(x, y)

    print(network.traverse_breadth_first("A"))

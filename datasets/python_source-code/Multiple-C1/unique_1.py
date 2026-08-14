"""
Graph BFS - Unique Submission
A genuinely distinct approach: BFS expressed as a lazy generator
that yields nodes one at a time, rather than building a full list.
"""

from collections import deque


def bfs_generator(graph, start):
    """Yield nodes in BFS order lazily, one at a time."""
    seen = {start}
    q = deque([start])

    while q:
        node = q.popleft()
        yield node
        for nxt in graph.get(node, []):
            if nxt not in seen:
                seen.add(nxt)
                q.append(nxt)


def take_until(gen, stop_node):
    """Consume the generator until (and including) stop_node."""
    collected = []
    for node in gen:
        collected.append(node)
        if node == stop_node:
            break
    return collected


if __name__ == "__main__":
    graph = {
        "root": ["left", "right"],
        "left": ["root", "left.left"],
        "right": ["root", "right.right"],
        "left.left": ["left"],
        "right.right": ["right"],
    }

    gen = bfs_generator(graph, "root")
    print("Full lazy traversal:", list(bfs_generator(graph, "root")))
    print("Stopping early at 'right':", take_until(bfs_generator(graph, "root"), "right"))

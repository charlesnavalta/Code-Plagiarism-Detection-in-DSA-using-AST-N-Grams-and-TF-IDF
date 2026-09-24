"""
Graph BFS - Organic Submission #3
Level-order BFS that also records the distance of each node from the source.
"""

from collections import deque


def bfs_with_levels(graph, source):
    distance = {source: 0}
    queue = deque([source])
    order = []

    while queue:
        node = queue.popleft()
        order.append((node, distance[node]))

        for neighbor in graph.get(node, []):
            if neighbor not in distance:
                distance[neighbor] = distance[node] + 1
                queue.append(neighbor)

    return order


def print_levels(result):
    for node, level in result:
        print(f"Node {node} -> level {level}")


if __name__ == "__main__":
    graph = {
        1: [2, 3],
        2: [1, 4],
        3: [1, 4, 5],
        4: [2, 3, 6],
        5: [3, 6],
        6: [4, 5],
    }
    print_levels(bfs_with_levels(graph, 1))

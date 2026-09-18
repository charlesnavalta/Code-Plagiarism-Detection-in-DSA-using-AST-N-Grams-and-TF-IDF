"""
Graph BFS - Structural Change Submission (queue -> recursion)
Same algorithm and output as organic_3.py (level-order BFS with distances),
but the iterative deque/while-loop is replaced with a recursive function
that processes one whole frontier (level) per call.
"""


def bfs_with_levels(graph, source):
    distance = {source: 0}
    order = []

    def process_frontier(frontier):
        if not frontier:
            return

        next_frontier = []
        for node in frontier:
            order.append((node, distance[node]))
            for neighbor in graph.get(node, []):
                if neighbor not in distance:
                    distance[neighbor] = distance[node] + 1
                    next_frontier.append(neighbor)

        process_frontier(next_frontier)

    process_frontier([source])
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

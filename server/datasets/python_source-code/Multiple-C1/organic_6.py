"""
Graph BFS - Organic Submission #6
Uses integer-indexed nodes (0..n-1) and a boolean visited array.
"""

from collections import deque


def bfs(num_nodes, adjacency_list, start):
    visited = [False] * num_nodes
    order = []
    q = deque()

    visited[start] = True
    q.append(start)

    while q:
        node = q.popleft()
        order.append(node)
        for nxt in adjacency_list[node]:
            if not visited[nxt]:
                visited[nxt] = True
                q.append(nxt)

    return order


if __name__ == "__main__":
    n = 6
    adj = [
        [1, 2],     # 0
        [0, 3, 4],  # 1
        [0, 5],     # 2
        [1],        # 3
        [1, 5],     # 4
        [2, 4],     # 5
    ]
    print(bfs(n, adj, 0))

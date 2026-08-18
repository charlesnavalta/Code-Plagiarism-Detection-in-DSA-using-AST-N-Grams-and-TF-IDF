"""
Graph BFS - Organic Submission #4
BFS over an adjacency matrix representation instead of an adjacency list.
"""

from collections import deque


def bfs_matrix(matrix, start_index):
    n = len(matrix)
    visited = [False] * n
    visited[start_index] = True
    queue = deque([start_index])
    result = []

    while queue:
        curr = queue.popleft()
        result.append(curr)

        for neighbor_index in range(n):
            if matrix[curr][neighbor_index] == 1 and not visited[neighbor_index]:
                visited[neighbor_index] = True
                queue.append(neighbor_index)

    return result


if __name__ == "__main__":
    # 0:A 1:B 2:C 3:D 4:E
    adj_matrix = [
        [0, 1, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 0, 0, 1],
        [0, 0, 1, 1, 0],
    ]
    labels = ["A", "B", "C", "D", "E"]
    order = bfs_matrix(adj_matrix, 0)
    print([labels[i] for i in order])

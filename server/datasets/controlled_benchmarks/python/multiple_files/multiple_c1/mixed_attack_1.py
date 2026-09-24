"""
Graph BFS - Mixed Attack Submission
Derived from organic_4.py (adjacency matrix BFS). Combines two evasion
techniques at once: identifier renaming AND statement reordering
(helper function moved below main logic, loop body lines swapped).
"""

from collections import deque


def bfs_over_matrix(adj_matrix, origin_index):
    total_nodes = len(adj_matrix)
    seen_flags = [False] * total_nodes
    traversal_order = []
    pending = deque([origin_index])
    seen_flags[origin_index] = True

    while pending:
        active = pending.popleft()

        for target_index in range(total_nodes):
            if adj_matrix[active][target_index] == 1 and not seen_flags[target_index]:
                pending.append(target_index)
                seen_flags[target_index] = True

        traversal_order.append(active)

    return traversal_order


def label_lookup(indices, labels):
    return [labels[i] for i in indices]


if __name__ == "__main__":
    labels = ["A", "B", "C", "D", "E"]
    adj_matrix = [
        [0, 1, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 0, 0, 1],
        [0, 0, 1, 1, 0],
    ]
    order = bfs_over_matrix(adj_matrix, 0)
    print(label_lookup(order, labels))

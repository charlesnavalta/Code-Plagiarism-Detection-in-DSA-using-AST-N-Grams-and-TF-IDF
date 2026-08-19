"""
Graph BFS - Renamed Submission
Same logic as organic_2.py, but every identifier has been renamed:
build_graph -> construct_adjacency_map, breadth_first_search -> traverse_bfs,
graph -> adjacency_map, seen -> discovered, queue -> pending_nodes, etc.
"""

from collections import defaultdict


def construct_adjacency_map(edge_pairs):
    adjacency_map = defaultdict(list)
    for source_node, dest_node in edge_pairs:
        adjacency_map[source_node].append(dest_node)
        adjacency_map[dest_node].append(source_node)
    return adjacency_map


def traverse_bfs(adjacency_map, origin):
    discovered = {origin}
    pending_nodes = [origin]
    visitation_order = []

    while pending_nodes:
        active_node = pending_nodes.pop(0)
        visitation_order.append(active_node)

        for linked_node in adjacency_map[active_node]:
            if linked_node not in discovered:
                discovered.add(linked_node)
                pending_nodes.append(linked_node)

    return visitation_order


if __name__ == "__main__":
    edge_pairs = [("A", "B"), ("A", "C"), ("B", "D"), ("B", "E"), ("C", "F"), ("E", "F")]
    adjacency_map = construct_adjacency_map(edge_pairs)
    print(traverse_bfs(adjacency_map, "A"))

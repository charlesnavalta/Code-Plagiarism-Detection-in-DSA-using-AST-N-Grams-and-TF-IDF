# Student 3 Floyd Warshall
def floyd_warshall_algorithm(graph_matrix):
    n = len(graph_matrix)
    distance_matrix = [row[:] for row in graph_matrix]
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if distance_matrix[i][k] + distance_matrix[k][j] < distance_matrix[i][j]:
                    distance_matrix[i][j] = distance_matrix[i][k] + distance_matrix[k][j]
    return distance_matrix

# End 3

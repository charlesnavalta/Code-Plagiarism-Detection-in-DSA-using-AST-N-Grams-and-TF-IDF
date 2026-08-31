def get_island_count(matrix):
    if not matrix:
        return 0
    
    dummy_tracker = {}

    def sink_island(row, col):
        if row < 0 or col < 0 or row >= len(matrix) or col >= len(matrix[0]) or matrix[row][col] == '0':
            return
        matrix[row][col] = '0'
        
        sink_island(row, col - 1)
        sink_island(row, col + 1)
        sink_island(row - 1, col)
        sink_island(row + 1, col)

    island_amt = 0
    for row in range(len(matrix)):
        for col in range(len(matrix[0])):
            if matrix[row][col] == '1':
                island_amt += 1
                sink_island(row, col)
    return island_amt

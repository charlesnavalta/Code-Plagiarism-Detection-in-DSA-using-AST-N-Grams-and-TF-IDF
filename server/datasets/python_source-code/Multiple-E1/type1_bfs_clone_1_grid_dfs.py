import collections

def numIslands(grid):
    if not grid:
        return 0
    islands = 0
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '1':
                islands += 1
                queue = collections.deque([(i, j)])
                grid[i][j] = '0'
                while queue:
                    row, col = queue.popleft()
                    for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
                        nr, nc = row + dr, col + dc
                        if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]) and grid[nr][nc] == '1':
                            queue.append((nr, nc))
                            grid[nr][nc] = '0'
    return islands

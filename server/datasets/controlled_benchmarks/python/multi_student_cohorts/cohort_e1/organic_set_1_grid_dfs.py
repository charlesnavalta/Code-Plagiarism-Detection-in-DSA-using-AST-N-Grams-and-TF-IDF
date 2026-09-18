def numIslands(grid):
    if not grid: return 0
    visited = set()
    count = 0

    def traverse(r, c):
        if r not in range(len(grid)) or c not in range(len(grid[0])) or grid[r][c] == "0" or (r, c) in visited:
            return
        visited.add((r, c))
        traverse(r + 1, c)
        traverse(r - 1, c)
        traverse(r, c + 1)
        traverse(r, c - 1)

    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == "1" and (r, c) not in visited:
                count += 1
                traverse(r, c)
    return count

def numIslands(grid):
    if not grid:
        return 0
    count = 0
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == '1':
                count += 1
                stack = [(r, c)]
                while stack:
                    curr_r, curr_c = stack.pop()
                    if 0 <= curr_r < len(grid) and 0 <= curr_c < len(grid[0]) and grid[curr_r][curr_c] == '1':
                        grid[curr_r][curr_c] = '0'
                        stack.append((curr_r + 1, curr_c))
                        stack.append((curr_r - 1, curr_c))
                        stack.append((curr_r, curr_c + 1))
                        stack.append((curr_r, curr_c - 1))
    return count

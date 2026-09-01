def numIslands(map_grid):
    if not map_grid: return 0
    seen = set()
    total = 0

    def check_node(y, x):
        if y not in range(len(map_grid)) or x not in range(len(map_grid[0])) or map_grid[y][x] == "0" or (y, x) in seen:
            return
        seen.add((y, x))
        check_node(y + 1, x)
        check_node(y - 1, x)
        check_node(y, x + 1)
        check_node(y, x - 1)

    for y in range(len(map_grid)):
        for x in range(len(map_grid[0])):
            if map_grid[y][x] == "1" and (y, x) not in seen:
                total += 1
                check_node(y, x)
    return total

def calculate_islands(ocean_map):
    if not ocean_map:
        return 0

    def explore_land(y, x):
        if y < 0 or x < 0 or y >= len(ocean_map) or x >= len(ocean_map[0]) or ocean_map[y][x] == '0':
            return
        ocean_map[y][x] = '0'
        moves = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        for dy, dx in moves:
            explore_land(y + dy, x + dx)

    total_islands = 0
    for y in range(len(ocean_map)):
        for x in range(len(ocean_map[0])):
            if ocean_map[y][x] == '1':
                total_islands += 1
                explore_land(y, x)
    return total_islands

import java.util.HashSet;
import java.util.Set;

public class Solution {
    public int numIslands(char[][] map_grid) {
        if (map_grid == null || map_grid.length == 0) return 0;
        Set<String> seen = new HashSet<>();
        int total = 0;

        for (int y = 0; y < map_grid.length; y++) {
            for (int x = 0; x < map_grid[0].length; x++) {
                if (map_grid[y][x] == '1' && !seen.contains(y + "," + x)) {
                    total++;
                    check_node(map_grid, y, x, seen);
                }
            }
        }
        return total;
    }

    private void check_node(char[][] map_grid, int y, int x, Set<String> seen) {
        if (y < 0 || y >= map_grid.length || x < 0 || x >= map_grid[0].length || map_grid[y][x] == '0' || seen.contains(y + "," + x)) {
            return;
        }
        seen.add(y + "," + x);
        check_node(map_grid, y + 1, x, seen);
        check_node(map_grid, y - 1, x, seen);
        check_node(map_grid, y, x + 1, seen);
        check_node(map_grid, y, x - 1, seen);
    }
}

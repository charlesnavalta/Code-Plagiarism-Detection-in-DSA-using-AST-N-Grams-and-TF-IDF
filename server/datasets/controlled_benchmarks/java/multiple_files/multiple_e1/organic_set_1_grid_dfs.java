import java.util.HashSet;
import java.util.Set;

public class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        Set<String> visited = new HashSet<>();
        int count = 0;

        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1' && !visited.contains(r + "," + c)) {
                    count++;
                    traverse(grid, r, c, visited);
                }
            }
        }
        return count;
    }

    private void traverse(char[][] grid, int r, int c, Set<String> visited) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] == '0' || visited.contains(r + "," + c)) {
            return;
        }
        visited.add(r + "," + c);
        traverse(grid, r + 1, c, visited);
        traverse(grid, r - 1, c, visited);
        traverse(grid, r, c + 1, visited);
        traverse(grid, r, c - 1, visited);
    }
}

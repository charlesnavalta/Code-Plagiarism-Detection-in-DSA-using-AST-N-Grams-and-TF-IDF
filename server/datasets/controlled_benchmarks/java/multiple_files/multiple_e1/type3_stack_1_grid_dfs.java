import java.util.Stack;

public class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) {
            return 0;
        }
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    Stack<int[]> stack = new Stack<>();
                    stack.push(new int[]{r, c});
                    while (!stack.isEmpty()) {
                        int[] curr = stack.pop();
                        int curr_r = curr[0];
                        int curr_c = curr[1];
                        if (curr_r >= 0 && curr_r < grid.length && curr_c >= 0 && curr_c < grid[0].length && grid[curr_r][curr_c] == '1') {
                            grid[curr_r][curr_c] = '0';
                            stack.push(new int[]{curr_r + 1, curr_c});
                            stack.push(new int[]{curr_r - 1, curr_c});
                            stack.push(new int[]{curr_r, curr_c + 1});
                            stack.push(new int[]{curr_r, curr_c - 1});
                        }
                    }
                }
            }
        }
        return count;
    }
}

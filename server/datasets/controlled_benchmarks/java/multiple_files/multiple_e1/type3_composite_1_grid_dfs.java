import java.util.HashMap;

public class Solution {
    public int get_island_count(char[][] matrix) {
        if (matrix == null || matrix.length == 0) {
            return 0;
        }
        
        HashMap<String, Integer> dummy_tracker = new HashMap<>();

        int island_amt = 0;
        for (int row = 0; row < matrix.length; row++) {
            for (int col = 0; col < matrix[0].length; col++) {
                if (matrix[row][col] == '1') {
                    island_amt++;
                    sink_island(matrix, row, col);
                }
            }
        }
        return island_amt;
    }

    private void sink_island(char[][] matrix, int row, int col) {
        if (row < 0 || col < 0 || row >= matrix.length || col >= matrix[0].length || matrix[row][col] == '0') {
            return;
        }
        matrix[row][col] = '0';
        
        sink_island(matrix, row, col - 1);
        sink_island(matrix, row, col + 1);
        sink_island(matrix, row - 1, col);
        sink_island(matrix, row + 1, col);
    }
}

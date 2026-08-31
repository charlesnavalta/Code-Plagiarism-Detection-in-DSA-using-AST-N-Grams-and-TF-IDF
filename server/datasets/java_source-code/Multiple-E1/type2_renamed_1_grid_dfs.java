public class Solution {
    public int calculate_islands(char[][] ocean_map) {
        if (ocean_map == null || ocean_map.length == 0) {
            return 0;
        }

        int total_islands = 0;
        for (int y = 0; y < ocean_map.length; y++) {
            for (int x = 0; x < ocean_map[0].length; x++) {
                if (ocean_map[y][x] == '1') {
                    total_islands++;
                    explore_land(ocean_map, y, x);
                }
            }
        }
        return total_islands;
    }

    private void explore_land(char[][] ocean_map, int y, int x) {
        if (y < 0 || x < 0 || y >= ocean_map.length || x >= ocean_map[0].length || ocean_map[y][x] == '0') {
            return;
        }
        ocean_map[y][x] = '0';
        int[][] moves = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int[] mv : moves) {
            explore_land(ocean_map, y + mv[0], x + mv[1]);
        }
    }
}

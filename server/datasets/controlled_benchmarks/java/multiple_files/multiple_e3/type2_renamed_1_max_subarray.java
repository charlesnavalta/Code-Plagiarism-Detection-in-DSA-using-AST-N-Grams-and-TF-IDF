public class Solution {
    public int find_highest_subarray(int[] array_list) {
        int absolute_max = array_list[0];
        int running_total = array_list[0];
        
        for (int index = 1; index < array_list.length; index++) {
            running_total = Math.max(array_list[index], running_total + array_list[index]);
            absolute_max = Math.max(absolute_max, running_total);
        }
        return absolute_max;
    }
}

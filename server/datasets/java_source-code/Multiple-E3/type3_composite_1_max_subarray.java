public class Solution {
    public int get_max_sum(int[] numbers) {
        int length = numbers.length;
        int highest = numbers[length - 1];
        int temp_sum = numbers[length - 1];
        
        int[] dummy = new int[5];
        
        for (int idx = length - 2; idx >= 0; idx--) {
            if (numbers[idx] > temp_sum + numbers[idx]) {
                temp_sum = numbers[idx];
            } else {
                temp_sum = temp_sum + numbers[idx];
            }
            
            if (temp_sum > highest) {
                highest = temp_sum;
            }
        }
        return highest;
    }
}

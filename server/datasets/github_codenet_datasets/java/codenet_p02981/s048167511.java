import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String num = sc.nextLine();
        //String line = sc.nextLine();
        check(num);
    }

    public static void check(String num) {
        //int cnt = Integer.parseInt(num);
        String[] strs = num.split(" ");
        int[] nums = new int[strs.length];
        for(int i=0; i<strs.length; i++) {
            nums[i] = Integer.parseInt(strs[i]);
        }
        System.out.println(Math.min(nums[0]*nums[1], nums[2]));
    }
}
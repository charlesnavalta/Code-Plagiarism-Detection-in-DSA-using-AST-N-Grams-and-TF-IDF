import java.util.*;

public class Main {
    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        
        int num = Integer.parseInt(sc.next());
        
        int five_hund = num / 500;
        int five = (num - five_hund * 500) / 5;
        
        System.out.println(1000 * five_hund + 5 * five);
    }
}
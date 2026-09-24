import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        Scanner scan = new Scanner(System.in);
        int n = scan.nextInt();
        int k = scan.nextInt();
        int size = 0;
        while (n != 0){
            n /= k;
            size ++;
        }
        System.out.println(size);
    }
}

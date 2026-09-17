import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int N = in.nextInt();

        System.out.println(Math.min(N * in.nextInt(), in.nextInt()));
    }
}
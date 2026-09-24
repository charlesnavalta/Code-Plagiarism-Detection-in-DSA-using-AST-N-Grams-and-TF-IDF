import java.util.*;
import java.io.*;
 
public class Main{
    static PrintWriter out = new PrintWriter(System.out);
 
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int N = Integer.parseInt(sc.next());
        int K = Integer.parseInt(sc.next());
        int i = 1;
        int A = N;
        while(A >= K){
            A = A/K;
            i++;
        }
        System.out.println(i);
       
    }
} 
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner stdIn = new Scanner(System.in);
        String input = stdIn.nextLine();
        String[] a = input.split(" ");
        int x = Integer.parseInt(a[0]);
        int n = Integer.parseInt(a[1]);
        input = stdIn.nextLine();
        int z = x;
        int w = x;
        int c = 0;
        int d = 0;
        String[] b = input.split(" ");

        if(b.length == n){
            while(true){
                for(int i = 0 ; i < b.length ; i++){
                    if(w == Integer.parseInt(b[i])){
                        c += 1;
                        w -= 1;
                    }
                    if(z == Integer.parseInt(b[i])){
                        c += 1;
                        z += 1;
                    }
                }
                if(c == 0){

                    break;
                }
                c = 0;
            }
            if(x - w > z - x){
                System.out.println(z);
            }else{
                System.out.println(w);
            }
        }else if(n == 0){
            System.out.println(x);
        }
    }
}

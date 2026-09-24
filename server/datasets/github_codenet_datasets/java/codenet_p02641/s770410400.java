import java.util.*;

class Main {
    private static Scanner sc;

    public static void main(final String[] args) {
        sc = new Scanner(System.in);
        int a = sc.nextInt(),b = sc.nextInt();
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < b; i++) list.add(sc.nextInt());
        if(!list.contains(a)){
            System.out.println(a);
            System.exit(0);           
        }     
        for (int i = 1; i <= 100; i++) {          
            a -= i;
            if(list.contains(a)){
                a += i*2;
                if(list.contains(a)){
                    a -= i;
                }else {
                    System.out.println(a);
                    System.exit(0);
                }
            }else {
                System.out.println(a);
                System.exit(0);
            }
           
        }
    }
}







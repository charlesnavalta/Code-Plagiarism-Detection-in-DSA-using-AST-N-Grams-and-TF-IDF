import java.io.*;

class Main{
    public static void main(String[] args){
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        try {
                int a, b;

                String line = reader.readLine();
                String[] strAry = line.split(" ");

                a = Integer.parseInt(strAry[0]);
                b = Integer.parseInt(strAry[1]);
                
                if(a < b){
                    System.out.println("a < b");
                }else if(a > b){
                    System.out.println("a > b");
                }else if(a == b){
                    System.out.println("a == b");
                }

        } catch (IOException e) {
            //TODO: handle exception
            System.out.println(e);
        }
    }
}
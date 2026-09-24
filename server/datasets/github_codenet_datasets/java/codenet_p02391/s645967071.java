import java.io.*;
import java.util.*;

class Main{
    public static void main(String args[]){
        try{
            BufferedReader reader=new BufferedReader(new InputStreamReader(System.in));
            String s=reader.readLine();
            StringTokenizer st=new StringTokenizer(s," ");
            
            String a=st.nextToken();
            String b=st.nextToken();
            
            int an=Integer.parseInt(a);
            int bn=Integer.parseInt(b);
            
            if(an<bn){
                System.out.println("a < b");
            }else if(an==bn){
                System.out.println("a == b");
            }else{
                System.out.println("a > b");
            }

        }catch(IOException e){
            System.out.println(e);
        }
    }
}
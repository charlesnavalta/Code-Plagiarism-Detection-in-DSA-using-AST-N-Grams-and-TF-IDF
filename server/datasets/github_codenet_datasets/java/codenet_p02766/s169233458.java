import java.util.Scanner;
public class Main{
 public static void main(String args[]){
  boolean flag=false;
  Scanner scan=new Scanner(System.in);
  String s;

  s=scan.next();
  long a=Long.parseLong(s);
  s=scan.next();
  long n=Long.parseLong(s);

  long ans=1;
  while(a/n>0){
   ans++;
   a/=n;
  }
  System.out.println(ans);
 }

 ///////////////////////////////////////////////
 public static boolean prime(long a){
  if(a<=1)return false;
  for(int i=2;i*i<=a;i++){
   if(a%i==0)return false;
  }
  return true;
 }
 public static long llpow(long x,long n){
  long ans=1;
  for(int i=0;i<n;i++)ans*=x;
  return ans;
 }
 public static long max(long a,long b){
  if(a<b)return b;
  else return a;
 }
 public static long min(long a,long b){
  if(a>b)return b;
  else return a;
 }
 public static long cei(long x,long y){
  long ans=x/y;
  if(x%y!=0)ans++;
  return ans;
 }
 public static long gcd(long x,long y){
  return (y==1)?gcd(y,x%y):x;
 }
 public static long lcm(long x,long y){
  return x/gcd(x,y)*y;
 }
 public static long fact(long x){
  long ans=1;
  for(int i=0;i<x;i++)ans*=(x-i);
  return ans;
 }
 public static long ncr(long n,long r){
  long ans=1,l=2;
  for(int i=0;i<min(n-r,r);i++){
   ans*=(n-i);
   while(ans%l==0&&l<=min(r,n-r)){
    ans/=l;l++;
   }
  }
  return ans;
 }
 public static long npr(long n,long r){
  long ans=1;
  for(int i=0;i<r;i++)ans*=(n-i);
  return ans; 
 }
 public static long fib(int x){
  long fibo[]=new long[x+10];
  fibo[0]=1;fibo[1]=1;
  for(int i=2;i<x+1;i++)fibo[i]=fibo[i-1]+fibo[i-2];
  return fibo[x];
 }
 public static long dig(long n){
  long d=1,tmp=n;
  while(tmp/10>0){
   tmp/=10;d++;
  }
  return d;}
}


n,k=map(int,input().split())
mod=10**9+7
count=0
for i in range(k,n+2):
    count+=((((2*n-i+1)*i)//2)-((i*(i-1))//2)+1)%mod
print(count%mod)
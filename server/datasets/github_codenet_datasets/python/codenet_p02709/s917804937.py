n,*a=map(int,open(0).read().split()) 
MX=2005
dp=[0]*(MX*10000+MX+100)
p=sorted([(a[i]*MX+i) for i in range(n)])[::-1]
for i in range(n):
    ai,pi=divmod(p[i],MX)
    for l in range(n):
        r=i-l
        if not 0<=r<=n:
            break
        dp[(i+1)*10000+(l+1)]=max(dp[(i+1)*10000+(l+1)],dp[(i)*10000+(l)]+ai*(pi-l))
        dp[(i+1)*10000+(l+0)]=max(dp[(i+1)*10000+(l+0)],dp[(i)*10000+(l)]+ai*(n-r-1-pi))
        
ans=0
for i in range(n+1):
    ans=max(ans,dp[n*10000+i])
print(ans)
    
        
        
        


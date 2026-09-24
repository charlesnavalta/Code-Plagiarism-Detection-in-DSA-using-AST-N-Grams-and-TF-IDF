n,k=map(int,input().split())
sm=0
for i in range(k,n+2):
  k2=i*(n-i+1)+1
  sm=(sm+k2)%(10**9+7)
print(sm)
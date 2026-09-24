n,k=map(int,input().split())

a=range(n+1)

max=sum(a[n+1-k:])
min=sum(a[:k])
ans=max-min+1
if n+1==k:
  print(ans)
  exit()
for i in range(k+1,n+2):
    max += a[n+1-i]
    min += a[i-1]
    ans += max-min+1
print(ans%(10**9+7))

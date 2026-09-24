n,k = map(int,input().split())
ans = 0

for i in range(k, n+2):
  a = 0.5* i* (i-1)
  b = 0.5* n* (n+1) - 0.5* (n-i)* (n-i+1)
  ans += int(b-a+1)
  
print(ans%(10**9+7))

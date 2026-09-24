n,k = map(int,input().split())
ans = 0
MOD = 10**9 + 7

for i in range(k,n+2):
  MIN = (i**2 - i)//2
  MAX = n*i - MIN
  ans += MAX - MIN + 1
  
print(ans%MOD)
n,k = map(int,input().split())
b = 0
c = 0
for i in range(k,n+2):
  b = n*i-i*(i-1)+1
  c +=b
print(c%(10**9+7))
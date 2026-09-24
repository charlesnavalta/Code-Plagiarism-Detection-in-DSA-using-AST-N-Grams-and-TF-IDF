import numpy as np

n, k = map(int, input().split())

ary = np.array([i for i in range(n+1)])

def lr(l,r): # 等差数列の'l'から'r'の和_mean*number
    return (l+r)*(r-l+1)//2

ans = 0
for j in range(k,n+2):
    l = lr(0, j-1)
    r = lr(n+1-j, n)
    ans += r-l+1
    ans %= 10**9+7
    
print(ans)

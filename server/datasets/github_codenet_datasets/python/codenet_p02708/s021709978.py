import sys
sys.setrecursionlimit(10**7)
input = sys.stdin.readline

n,k = map(int, input().split())
mod = 10**9+7

ans = 0
for i in range(k, n + 2):
    mi = (i - 1) * i // 2
    ma = (n + n - i + 1) * i // 2
    ans += ma - mi + 1
print(ans % mod)

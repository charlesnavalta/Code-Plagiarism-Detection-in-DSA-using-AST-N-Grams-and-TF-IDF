N,K = map(int,input().split())
MOD = 10**9+7

mn = mx = 0
for i in range(K):
    mn += i
    mx += N-i
ans = mx - mn + 1

for i in range(K,N+1):
    mn += i
    mx += N-i
    ans += mx - mn + 1
    ans %= MOD

print(ans%MOD)
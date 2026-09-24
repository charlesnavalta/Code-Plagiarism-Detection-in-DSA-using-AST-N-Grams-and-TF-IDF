N,K = map(int, input().split())
div = 10**9 + 7
ans = 0
for p in range(K,N+2):
    ans += p * (N - p + 1) + 1
    
print(ans%div)
N, K = map(int, input().split())
mod = pow(10, 9)+7
Cmax = ((N+N-K+1)*K)//2
Cmin = ((K-1)*K)//2
ans = 1
for i in range(K, N+1):
    ans = (ans+Cmax-Cmin+1)
    Cmin += i
    Cmax += (N-i)

print(ans % mod)

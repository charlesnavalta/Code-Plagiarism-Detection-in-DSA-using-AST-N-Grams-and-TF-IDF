n = int(input())
a = [(int(x), i+1) for i, x in enumerate(input().split())]

a = sorted(a, reverse=True)

dp = [[0]*(n+1) for __ in range(n+1)]

for k in range(1, n+1):
    child = a[k-1][0]
    ind = a[k-1][1]
    for i in range(k+1):
        if i != 0:
            dp[i][k-i] = dp[i-1][k-i] + child*(ind-i)
        if k-i != 0:
            dp[i][k-i] = max(dp[i][k-i], dp[i][k-i-1] + child*((n+1-(k-i))-ind))

ans = 0

for i in range(n+1):
    ans = max(ans, dp[i][n-i])

print(ans)
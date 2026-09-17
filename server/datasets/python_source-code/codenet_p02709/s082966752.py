n = int(input())
A = list(map(int, input().split()))
a = []
for i in range(len(A)):
    a.append([A[i], i])
a.sort(key = lambda x: x[0], reverse = True)
dp = [[0 for i in range(n+1)] for j in range(n+1)]
for i in range(n):
    for l in range(i+1):
        dp[i+1][l] = max(dp[i+1][l], dp[i][l] + a[i][0]*(n-1-(i-l)-a[i][1]))
        dp[i+1][l+1] = max(dp[i+1][l+1], dp[i][l] + a[i][0] * (a[i][1] - l))
ans = 0
for now in dp[n]:
    ans = max(now, ans)
print(ans)



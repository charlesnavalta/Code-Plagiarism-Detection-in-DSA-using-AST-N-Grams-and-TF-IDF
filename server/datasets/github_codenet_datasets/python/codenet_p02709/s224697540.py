import sys,math,copy,queue,itertools,bisect
LI = lambda : [int(x) for x in sys.stdin.readline().split()]
NI = lambda : int(sys.stdin.readline())

N = NI()
data = [[a,i] for i,a in enumerate(LI())]
data.sort(reverse=True)

dp = [[0 for _ in range(N+1)] for _ in range(N+1)]

for i in range(N):
    a, p = data[i]
    for j in range(i+1):
        dp[i+1][j+1] = max(dp[i+1][j+1],dp[i][j] + abs(N-1-j-p)*a)
        dp[i+1][j] = max(dp[i+1][j], dp[i][j] + abs(i-j-p)*a)
print(max(dp[-1]))

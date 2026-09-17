#!/usr/bin/env python3
import sys, math, itertools, collections, bisect, heapq
input = lambda: sys.stdin.buffer.readline().rstrip().decode('utf-8')
inf = float('inf') ;mod = 10**9+7
mans = inf ;ans = 0 ;count = 0 ;pro = 1

n = int(input())
A = list(map(int,input().split()))

data = [(ai,i) for i,ai in enumerate(A)]
data.sort(reverse = True)

dp = [[0]*(n+1) for i in range(n+1)]
for i in range(n):
  for l in range(i+1):
    r = i-l
    dp[l+1][r] = max(dp[l+1][r], dp[l][r] + data[i][0] * abs(data[i][1] - l))
    dp[l][r+1] = max(dp[l][r+1], dp[l][r] + data[i][0] * abs(data[i][1] - (n-1-r)))

ans = 0
for i in range(n):
  ans = max(ans,dp[i][n-i])
print(ans)
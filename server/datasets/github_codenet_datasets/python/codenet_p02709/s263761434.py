# coding: utf-8

import sys
import math
import collections
import itertools
INF = 10 ** 13
MOD = 10 ** 9 + 7
def input() : return sys.stdin.readline().strip()
def lcm(x, y) : return (x * y) // math.gcd(x, y)
def I() : return int(input())
def LI() : return [int(x) for x in input().split()]
def RI(N) : return [int(input()) for _ in range(N)]
def LRI(N) : return [[int(x) for x in input().split()] for _ in range(N)]
def LS() : return input().split()
def RS(N) : return [input() for _ in range(N)]
def LRS(N) : return [input().split() for _ in range(N)]
def PL(L) : print(*L, sep="\n")
def YesNo(B) : print("Yes" if B else "No")
def YESNO(B) : print("YES" if B else "NO")

N = I()
A = LI()

A = sorted([[a, i] for i, a in enumerate(A)], reverse=True, key=lambda x : x[0])

dp = [[0] * (N+1) for _ in range(N+1)]
for i in range(N):
    for j in range(N-i):
        dp[i+1][j] = max(dp[i+1][j], dp[i][j] + A[i+j][0] * (A[i+j][1] - i))
        dp[i][j+1] = max(dp[i][j+1], dp[i][j] + A[i+j][0] * ((N-j-1) - A[i+j][1]))

res = 0
for i in range(N):
    res = max(res, dp[i][N-i])

print(res)

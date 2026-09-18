import sys
sys.setrecursionlimit(10 ** 7)

N = int(input())
infants = []
for i, A in enumerate(map(int, input().split(' '))):
    infants.append((-A, i + 1))
infants.sort()
dp = [[-1 for _ in range(N + 1)] for _ in range(N + 1)]


def search(i, l):
    # i番目の幼児を見ていて左にl人配置している
    if i == N:
        return 0
    if dp[i][l] != -1:
        return dp[i][l]
    (act_val, pos) = infants[i]
    act_val = -act_val
    ans = max(search(i + 1, l + 1) + abs(l + 1 - pos) * act_val,
              search(i + 1, l) + abs(N - i + l - pos) * act_val)
    dp[i][l] = ans
    return ans


print(search(0, 0))
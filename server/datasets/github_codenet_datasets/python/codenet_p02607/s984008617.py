def solve(n, a):
    ans = 0
    for i in range(n):
        if (i % 2 == 0) and (a[i] % 2 == 1):
            ans += 1
    return ans

n = int(input())
a = list(map(int, input().split()))
print(solve(n, a))
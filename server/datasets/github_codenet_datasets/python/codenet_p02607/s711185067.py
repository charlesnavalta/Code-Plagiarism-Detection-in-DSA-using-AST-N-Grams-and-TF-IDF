N = int(input())
*a, = map(int, input().split())
ans = 0
for i in range(N):
    if a[i] % 2 != 0 and (i+1) % 2 != 0:
        ans += 1
print(ans)
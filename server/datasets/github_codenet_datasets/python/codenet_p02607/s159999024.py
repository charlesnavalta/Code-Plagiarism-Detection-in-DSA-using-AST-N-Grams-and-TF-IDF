N = int(input())
a = list(map(int, input().split()))
cnt = 0
for i in range(0, N, 2):
    if a[i] % 2 == 1:
        cnt += 1
print(cnt)
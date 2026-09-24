n = int(input())
A = [int(x) for x in input().split()]

cnt = 0
for i in range(n):
    if (i+1)%2 != 0 and A[i]%2 != 0:
        cnt += 1

print(cnt)
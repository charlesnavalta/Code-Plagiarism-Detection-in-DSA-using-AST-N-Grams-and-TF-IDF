N = int(input())
A = list(map(int, input().split()))
count = 0
for a in A[0::2]:
    if a % 2 == 1:
        count = count + 1
print(count)
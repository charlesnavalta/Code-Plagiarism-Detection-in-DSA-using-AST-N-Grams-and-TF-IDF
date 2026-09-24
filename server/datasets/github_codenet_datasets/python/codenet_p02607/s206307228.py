n = int(input())
z = input().split()
odd = 0
for i in range(n):
    if i % 2 == 0:
        if int(z[i]) % 2 == 1:
            odd += 1
print(odd)
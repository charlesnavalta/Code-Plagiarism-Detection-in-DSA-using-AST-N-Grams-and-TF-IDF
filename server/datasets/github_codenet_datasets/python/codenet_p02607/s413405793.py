N = int(input())
li = []
for i in input().split():
    li.append(int(i))

a = 1
count = 0
for i in li:
    if a % 2 == 1 and i % 2 == 1:
        count += 1
    a += 1
print(count)

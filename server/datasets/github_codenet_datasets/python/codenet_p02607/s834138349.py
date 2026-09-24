N = int(input())
s_list = input().split()
count = 0

for i in range(1, N+1):
  if (i % 2 == 1) and int(s_list[i-1]) % 2 == 1:
    count += 1

print(count)

n = int(input())
ans = 0
a = [int(i) for i in input().split()]
idx = 1
for i in a:
	if idx == 1 and i % 2 == 1:
		ans += 1
	idx ^= 1
print(ans)
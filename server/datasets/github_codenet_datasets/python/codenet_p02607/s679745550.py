N = int(input())
As = list(map(int, input().split()))

ans = 0
for i, A in enumerate(As):
  if i % 2 == 0 and A % 2 == 1:
    ans += 1
    
print(ans)
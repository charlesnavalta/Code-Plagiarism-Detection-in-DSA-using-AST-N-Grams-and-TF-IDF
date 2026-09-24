n = int(input())
a = list(map(int, input().split()))
counter = 0
for i in range((len(a)+1)//2):
  if a[i*2]%2 == 1:
    counter += 1
print(counter)
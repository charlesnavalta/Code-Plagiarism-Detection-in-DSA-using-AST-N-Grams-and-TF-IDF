n=int(input())
l=list(map(int,input().split()))
count=0
for i in range(n):
    if i%2==0 and l[i]%2==1:
        count += 1
print(count)
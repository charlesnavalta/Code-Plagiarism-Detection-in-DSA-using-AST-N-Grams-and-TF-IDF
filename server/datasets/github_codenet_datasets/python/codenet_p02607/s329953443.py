n=int(input())
L=[int(i) for i in input().split()]
count=0
for i in range(1,n+1,2):
  if(L[i-1]%2!=0):
    count+=1
print(count)
x=int(input())
li=list(map(int, input().split()))
res=0
i=0
while i<x:
  if li[i]%2!=0:
    res+=1
  i+=2
print(res)
import math
n=int(input())
ans=0
count=0
while True:
  if ans!=0 and ans%360==0:
    break
  else:
    count+=1
    ans+=n
print(count)

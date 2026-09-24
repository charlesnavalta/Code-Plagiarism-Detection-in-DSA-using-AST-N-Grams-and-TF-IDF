n=int(input())
x=n
c=1
while(x%360):
    x+=n
    x%=360
    c+=1
print(c)

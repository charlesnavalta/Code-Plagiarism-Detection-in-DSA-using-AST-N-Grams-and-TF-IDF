x = int(input())
dum = 360-x
ans = dum
for i in range(360):
    if ans%360 == 0:
        break
    ans += dum
print(i+1)
import math

n = int(input())

cnt = 0
x = 0
y = 0
r = 0

while True:
    cnt += 1
    x += round(math.cos(math.radians(r)), 6)
    y += round(math.sin(math.radians(r)), 6)
    r += n
    
    if x <= 0.00000001 and y <= 0.00000001:
        break

print(cnt)
x = int(input())
now = 0
ans = 0
while True:
    ans += 1
    now += x
    if now % 360 == 0:
        print(ans)
        exit()
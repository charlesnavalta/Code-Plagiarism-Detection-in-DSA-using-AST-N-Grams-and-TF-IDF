X = int(input())

k = 1
while True:
    if (X*k) % 360 == 0:
        print(k)
        break
    k += 1

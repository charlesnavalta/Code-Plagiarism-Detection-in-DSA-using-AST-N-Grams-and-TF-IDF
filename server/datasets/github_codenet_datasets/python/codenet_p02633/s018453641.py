import math
X = int(input())

i = 1
while True:
    net = (i * X)/360
    if math.floor(net) == math.ceil(net):
        break
    else:
        i+=1
print(i)
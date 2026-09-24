import math

def lcm(a, b):
    return int(a * b / math.gcd(a, b))

X = int(input())
print(int(lcm(X, 360) / X))
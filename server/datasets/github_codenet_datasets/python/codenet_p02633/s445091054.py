import math

x = int(input())


def lcm(a, b):
    return (a * b) // math.gcd(a, b)


rad = lcm(360, x)
print(rad//x)
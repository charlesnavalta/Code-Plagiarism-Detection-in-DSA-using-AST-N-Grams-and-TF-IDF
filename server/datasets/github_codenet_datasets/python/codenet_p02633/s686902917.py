def lcm(x, y):
   if x > y:
       greater = x
   else:
       greater = y
 
   while(True):
       if((greater % x == 0) and (greater % y == 0)):
           lcm = greater
           break
       greater += 1
 
   return lcm
x = int(input())
if 360%x == 0:
    print(int(360/x))
else :
    print(int(lcm(360,x)/x))

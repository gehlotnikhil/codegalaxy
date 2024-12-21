a = `#include <stdio.h>
int main() {
    int num1, num2, num3, sum;
    scanf("%d", &num1);
    scanf("%d", &num2);
    scanf("%d", &num3);
    sum = num1 + num2 + num3;
    printf("%d" ,sum);
    return 0;
}

`
console.log(JSON.stringify(a))

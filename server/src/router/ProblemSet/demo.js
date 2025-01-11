let c = `#include <stdio.h>
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
let cpp = `
#include <iostream>
using namespace std;

int main() {

  int first_number, second_number, sum;
    
  cout << "Enter two integers: ";
  cin >> first_number >> second_number;

  // sum of two numbers in stored in variable sumOfTwoNumbers
  sum = first_number + second_number;

  // prints sum 
  cout << first_number << " + " <<  second_number << " = " << sum;     

  return 0;
}
`

let java=`

`
let go = `

`

console.log("c-> ",JSON.stringify(c))
console.log("c++-> ",JSON.stringify(a))
console.log("java-> ",JSON.stringify(a))
console.log("go-> ",JSON.stringify(a))

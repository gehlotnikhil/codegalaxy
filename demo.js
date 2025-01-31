const problem = {  
	problemName: "Two Sum",
	description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\nYou can return the answer in any order.",
	companies: ["BookMyShow", "Uber"],
	constraint: [
	  "2 <= nums.length <= 10^4",
	  "-10^9 <= nums[i] <= 10^9",
	  "-10^9 <= target <= 10^9",
	],
	topic: ["ARRAY"],
	category: "ALGORITHMS",
	sampleInputOutput: [
	  {
		input: "nums = [2,7,11,15], target = 9",
		output: "[0,1]",
	  },
	  {
		input: "nums = [3,2,4], target = 6",
		output: "[1,2]",
	  },
	],
	testcases: [
	  {
		input: "4 2 7 11 15 9",
		output: "[0,1]",
	  },
	  {
		input: "3 3 2 4 6",
		output: "[1,2]",
	  },
	],
	aboveCodeTemplate: {
	  c: `#include <stdio.h>
	#include <stdlib.h>
	`,
	  java: `import java.util.*;

public class TwoSum {
	`,
	  go: `package main

import (
	"fmt"
)
`,
	  cpp: `#include <iostream>
#include <map>
#include <vector>

using namespace std;
`,
	},
	belowCodeTemplate: {
	  java: `    
	  public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Get the size of the array from user
        int n = scanner.nextInt();

        int[] nums = new int[n];

        // Take array input from user
        for (int i = 0; i < n; i++) {
            nums[i] = scanner.nextInt();
        }

        // Get the target value from user
        int target = scanner.nextInt();

        // Call the twoSum function
        int[] result = twoSum(nums, target);

        // Output the result
        if (result.length == 0) {
            System.out.println("No solution found.");
        } else {
            System.out.println("[" + result[0] + "," + result[1] + "]");
        }

        scanner.close();
    }
}
`,
	  c: `
	int main() {
		int n;
		scanf("%d", &n);
		int nums[n];
		for (int i = 0; i < n; i++) {
			scanf("%d", &nums[i]);
		}
		int target;
		scanf("%d", &target);
		int returnSize;
		int* result = twoSum(nums, n, target, &returnSize);
		printf("[%d,%d]", result[0], result[1]);
		free(result);
		return 0;
	}`,
	  go: `
	
func main() {
	var n, target int

	// Get the size of the array from user
	fmt.Scan(&n)

	nums := make([]int, n)

	// Take array input from user
	for i := 0; i < n; i++ {
		fmt.Scan(&nums[i])
	}

	// Get the target value from user
	fmt.Scan(&target)

	// Call the twoSum function
	result := twoSum(nums, target)

	// Output the result
	if len(result) == 0 {
		fmt.Println("No solution found.")
	} else {
		fmt.Printf("[%d,%d]", result[0], result[1])
	}
}
`,
	  cpp: `
	
int main() {
    int n, target;
    
    // Get the size of the array from user
    cin >> n;
    
    vector<int> nums;
    
    // Take array input from user
    for (int i = 0; i < n; ++i) {
        int num;
        cin >> num;
        nums.push_back(num);
    }

    // Get the target value from user
    cin >> target;

    // Call the twoSum function
    vector<int> result = twoSum(nums, target);

    // Output the result
    if (result.empty()) {
        cout << "No solution found." << endl;
    } else {
        cout <<"["<<result[0] << "," << result[1]<<"]" << endl;
    }
    
    return 0;
}

	`,
	},
	middleCode: {
	  c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
		// Write Code Here
	}`,
	  java: ` public static int[] twoSum(int[] nums, int target) {
		// Write Code Here
        }`,
	  go: `func twoSum(nums []int, target int) []int {
		// Write Code Here
}`,
	  cpp: `vector<int> twoSum(vector<int>& nums, int target) {
		// Write Code Here
}
`,
	},
  };
  
  const createProblem = async () => {
	try {
	  const response = await fetch("http://localhost:8000/api/problemset/create", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify(problem),
	  });
	  
	  const data = await response.json();
	  console.log("Response:", data);
	} catch (error) {
	  console.error("Error:", error);
	}
  };
  
  createProblem();
  
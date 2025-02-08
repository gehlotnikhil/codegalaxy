let correctMiddleCode= {
    c: `
    int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
int* result = (int*)malloc(2 * sizeof(int)); // Allocate memory for two indices
*returnSize = 2;

for (int i = 0; i < numsSize; i++) {
    for (int j = i + 1; j < numsSize; j++) {
        if (nums[i] + nums[j] == target) {
            result[0] = i;
            result[1] = j;
            return result;
        }
    }
}

*returnSize = 0;
free(result);
return NULL; // Return NULL if no solution is found
}
      `,
    java: `

public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> numMap = new HashMap<>(); // Replacing map<int, int> with HashMap<Integer, Integer>
    
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        
        if (numMap.containsKey(complement)) {
            return new int[]{numMap.get(complement), i}; // Returning the indices
        }
        
        numMap.put(nums[i], i);
    }
    return new int[]{}; // Returning an empty array if no solution is found
}
      `,
    go: `
        func twoSum(nums []int, target int) []int {
numMap := make(map[int]int) // Replace map<int, int> with a Go map[int]int

for i, num := range nums {
    complement := target - num
    if index, found := numMap[complement]; found {
        return []int{index, i} // Returning the indices
    }
    numMap[num] = i
}
return []int{} // Returning an empty slice if no solution is found
}
      `,
    cpp: `
vector<int> twoSum(vector<int>& nums, int target) {
map<int, int> numMap; // Replace unordered_map with map
for (size_t i = 0; i < nums.size(); ++i) {
    int complement = target - nums[i];
    map<int, int>::iterator it = numMap.find(complement);
    if (it != numMap.end()) {
        vector<int> result; // Manually create a vector
        result.push_back(it->second); // First index
        result.push_back(i); // Second index
        return result;
    }
    numMap[nums[i]] = static_cast<int>(i);
}
return vector<int>(); // Return an empty vector if no solution
}

`,
  }

  console.log(JSON.stringify({c:correctMiddleCode.c}));
  console.log("\n");
  console.log(JSON.stringify({cpp:correctMiddleCode.cpp}));
  console.log("\n");
  console.log(JSON.stringify({java:correctMiddleCode.java}));
  console.log("\n");
  console.log(JSON.stringify({go:correctMiddleCode.go}));
  console.log("\n");
  
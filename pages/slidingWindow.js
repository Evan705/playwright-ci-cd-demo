//Minimum Size SubArray Sum
//Leet Code 209
//Input -[1, 2, 4, 3, 2, 1] target = 7
//Output - 2; [4,3] is the sub-array

// const { count } = require("node:console");
// const { array } = require("node:stream/iter");

// 1 + 2 + 4 => 3 numbers for a total of 7
// 3 + 1 + 2 + 4 => 4 numbers
// 1 + 2 + 4 => 3 numbers
// 2 + 4 + 3 => 3 numbers
// 4 + 3 => 2 numbers

// var minSizeSubArray = function(nums,target)
// {
//     let previousTotal = 0;
//     let lowestCount = 0;
//     for(let i = 0; i < nums.length; i++)
//     {
//         previousTotal += nums[i];
//         lowestCount++;
//         if(previousTotal>=target)
//         {
//             break;
//         }
//     }
//     //previousTotal = 8
//     //lowestCount = 4
//     for(let i=1; i<nums.length; i++)
//     {
//         let currentTotal = previousTotal - nums[i-1];
//         if(currentTotal>=target)
//         {
//             lowestCount--;
//             previousTotal = currentTotal;
//         }
//         else{
//             currentTotal = previousTotal + nums[i+lowestCount-1];
//         }
//     }
//     return previousTotal;

// }
// console.log(minSizeSubArray([1,2,4,3,2,1],7));

var minSizeSubArray = function(nums, target)
{
    let lowestCount = Infinity;
    let left = 0;
    let previousTotal = 0;
    let result = [];

    for(let i = 0; i < nums.length; i++)
    {
        previousTotal += nums[i];

        while(previousTotal >= target)
        {
            let currentCount = i - left + 1;

            if(currentCount < lowestCount)
            {
                lowestCount = currentCount;
                result = nums.slice(left, i + 1);
            }

            previousTotal = previousTotal - nums[left];
            left++;
        }
    }

    if(lowestCount === Infinity)
    {
        return {
            count: 0,
            array: []
        };
    }

    return {
        count: lowestCount,
        array: result
    };
}

console.log(minSizeSubArray([1,2,4,3,1,1,1],7));
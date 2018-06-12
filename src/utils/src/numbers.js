
// js 数字计算问题
export function getTotalNumner(numbers = [], times = 100) {
  let timesTotal = 0
  numbers.forEach(n => {
      let t = n * times
      timesTotal += t
  });
  return timesTotal / times
}
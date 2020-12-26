const moment = require('moment')

exports.timeLefted = function(expectedDurtion=3, info) {
  let alert = false;
  const todayStart = moment().format('YYYY-MM-DD 7:00')
  const todayNow = moment().format('YYYY-MM-DD HH:mm')
  const todayEnd = moment().format('YYYY-MM-DD 22:00')
  const {orderLists} = info;
  const times = orderLists.map(item => {
    return [
      item.start,
      item.end
    ]
  }).sort()
  times.unshift([null, todayStart])
  times.push([todayEnd, null])
  // console.log(times)
  const leftTimes = [];
  for(let i = 0; i < times.length - 1; i++) {
    if(moment(times[i+1][0]).diff(moment(times[i][1]), 'minutes') > 180){
      // alert = true;
      leftTimes.push([times[i][1], times[i+1][0]])
    }
  }
  const filternows = leftTimes.filter(item => {
    return moment(item[1]).diff(moment(), 'minutes') > 0
  })
  return filternows
}
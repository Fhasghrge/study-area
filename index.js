const http = require('http')
const timeLefted = require('./timeLefted').timeLefted
const cookie = require('./selfinfos.js').cookie
const transporter = require('./sendEmail').transporter

const url = 'http://reservelib.uestc.edu.cn/ClientWeb/pro/ajax/device.aspx?classkind=1&prop=0&title=%E9%A2%84%E7%BA%A6%E7%A0%94%E4%BF%AE%E5%AE%A4&kind_id=101710042,101710044,100547050,100547052,100647898,100656264,100647900&kinds=101710042,101710044,100547050,100547052,100647898,100656264,100647900&date=2020-12-26&fr_start=&fr_end=&act=get_rsv_sta&_nocache=1608959677732'
http.get(url, {
  headers: {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    Host: 'reservelib.uestc.edu.cn',
    Connection: 'keep-alive',
    Cookie: cookie
  }
},function(req,res){
	var html='';
	req.on('data',function(data){
		html+=data;
	});
	req.on('end',function(){
    const jsonData = JSON.parse(html);
    const {data} = jsonData;
    const filterShahe = data.filter(item => item.name.indexOf('S-') === -1)
    console.log(filterShahe)
    const formatData = filterShahe.map(item => {
      const infos = timeLefted(3,{
        name: item.name,
        location: item.labName,
        orderLists: item.ts
      })
      
      return infos;
    });
    const tips = formatData.filter(item => item.length > 0)
    console.log(tips)
    if(tips.length > 0) {
      transporter.sendMail({
        from: '2490300986@qq.com', // sender address
        to: '1969533391@qq.com', // list of receivers
        subject: '有研修室可以抢啦! @_@', // Subject line
        // 发送text或者html格式
        // text: 'Hello world?', // plain text body
        html: `<b>${tips.toString()}</b>` // html body
      },(error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
      })
    }

	});
});

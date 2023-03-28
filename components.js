const axios = require('axios');

const statusList = {
    11: "➖ Недозвоненные",
    13: "🗑 Треш",
    21: "⚠️ CHECK",
    1: "✅ Принят",
    28: "👌 Подтвержден",
    51: "👌 Подтвержден- Вчера",
    30: "👌 Принят-(отправить позже)",
    15: "📦 Сборка и упаковка",
    29: "Принят-(отменен)",
    5: "💰 Оплачен",
    4: "💸 Ждет оплаты",
    3: "🚚 Отправлен",
    44: "АВТО",
    17: "🚚 Прибыл",
    19: "Изменен адрес",
    16: "🫤 Невыкуп",
    2: "❌ Отменен",
    23: "🙅 Отказ",
    9: "😬 Ошибки",
    31: "Принят-(отменена по ВХ)",
    7: "🔙 Возврат",
    49: "🔙 Отказ на Почте",
    27: "🧹 Утилизация",
    26: "🗑 Недозвоны(треш)",
    34: "🗑 Мусор",
    41: "❌ Видалено",
    42: "Номер не знайдено",
    50: "Обработка(старое)",
    0: "🧐 Обработка"
}

function getStatusVal(statusList, statusId) {
    return statusList[statusId]
}

let apiRequestList = {
    apiForId: '',    
    apiForOrdersList: ''
}

function getChtoDo(ctx, id) {
    let phone;    
    axios(`${apiRequestList.apiForId}${id}`)
        .then(response => {            
            if(response.data[id]){
                phone = response.data[id].phone;

            axios(`${apiRequestList.apiForOrdersList}${phone}`)
                .then(response => {
                    phoneOrders = response.data
                    getOrderHistory(apiRequestList, phoneOrders, ctx)
                }).catch(err => console.log(err))
            }else{
                ctx.reply('Данных не обнаружено', { reply_to_message_id: ctx.msg.message_id })
            }
        }).catch(err => console.log(err))
}

function getOrderHistory(api, ids, ctx) {
    axios(`${api.apiForId}${ids}`)
        .then(response => {
            let idsInfo = Object.entries(response.data);            
            ctx.session.strResponse = idsInfo.map(item => {
                if(item[1].goods != null && item[1].goods != undefined){
                    prop = Object.keys(item[1].goods)[0];
                    let offerDate = item[1].datetime.match(/.*\s/);
                    return `
📆 ${offerDate}
${getStatusVal(statusList, item[1].status)}
🛒 ${item[1].goods[prop].name}
`;
                }
            })
            getMsgInfo(ctx);
        }).catch(err => console.log(err))
}

function getMsgInfo(ctx) {
    let str = ctx.session.strResponse.toString().replace(/,/g, '');
    
    if(str.length > 4096){
        cutStr(str,ctx,4096);
    }
    else{
        ctx.reply(`☎️ История общений
        ${str}`, { reply_to_message_id: ctx.msg.message_id })
    }
}

function getNomer(ctx, id) {    
    axios(`${apiRequestList.apiForId}${id}`)
        .then(response => {
            if(response.data[id]){//может приходить undefined
                ctx.reply(`📟 ${response.data[id].phone}`, { reply_to_message_id: ctx.msg.message_id })
            }else{
                ctx.reply('Данных не обнаружено', { reply_to_message_id: ctx.msg.message_id })
            }
        }).catch(err => console.log(err))
}

async function cutStr(str,ctx,index){
   
    let arr = [];
    while(str.length >= index){
        subStr = str.slice(0, index);
        arr.push(subStr);
        str = str.slice(index);
    }
    await arr.push(str);

     for(let i = 0; i < arr.length; i++){
       await ctx.reply(`${arr[i]}`);
     }
}


module.exports = {
    getChtoDo,
    getNomer
}

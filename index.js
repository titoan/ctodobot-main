const { default: axios } = require("axios");
const { Bot, session } = require("grammy");
const { getChtoDo, getNomer } = require('./components')
require("dotenv").config();

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);

function initial() {
    return {       
        strResponse: []       
    }
}

bot.use(session({ initial }));

bot.on(':text', ctx => {
try{
    if(ctx.update.message.chat.id === -1001297600530){
        let text = ctx.message.text.replace(/\s/g, '').toLowerCase();    
    
        if (text.match(/[0-9]чтодо/) || text.match(/[0-9]чтобыло/) || text.match(/[0-9]чтотут/) || text.match(/[0-9]щодо/)) {
            let id = ctx.message.text.match(/[0-9]/g).toString().replace(/,/g, '');
            getChtoDo(ctx, id);
        }
    
        if (text.match(/[0-9]номер/)) {
            let id = ctx.message.text.match(/[0-9]/g).toString().replace(/,/g, '');
            getNomer(ctx, id);
        }
    }else{
        ctx.reply('Пишите в общий чат')
    }
}catch(e){
    console.log(e)
}


})

bot.on('edited_message:text', ctx => {

try{
    if(ctx.update.message.chat.id === -1001297600530){
        let text = ctx.update.edited_message.text.replace(/\s/g, '').toLowerCase();
    
        if (text.match(/[0-9]чтодо/) || text.match(/[0-9]чтобыло/) || text.match(/[0-9]чтотут/) || text.match(/[0-9]щодо/)) {
            let id = text.match(/[0-9]/g).toString().replace(/,/g, '');
            getChtoDo(ctx, id);
        }
        
        if (text.match(/[0-9]номер/)) {
            let id = text.match(/[0-9]/g).toString().replace(/,/g, '');
            getNomer(ctx, id);
            }
    }else{
        ctx.reply('Пишите в общий чат')
    }
}catch(e){
    console.log(e)
}

})

bot.start();


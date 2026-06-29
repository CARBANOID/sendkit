import { Command } from "commander" ;
import { sendTelegramMessage } from "sendkit-core" ;

const program = new Command() ;

program
    .name("sendkit")
    .description("SendKit tutorial CLI")
    .command("telegram")   // name of tool
    .description("Send a Telegram message")
    .argument("<chatId>","Telegram chat ID")  // 1st argument
    .argument("<message>","Message text to send") // 2nd argument
    .action(async(chatId : string,message : string) => { // argument (chatId: string, message: string) are extracted in order of their defination
        const token = process.env.TELEGRAM_BOT_TOKEN ;

        if(!token) {
            console.error("Missing TELEGRAM_BOT_TOKEN environment variable") ;
            process.exit(1) ; // CLI quit method
        }

        if(!chatId) {
            console.error("Missing Telegram chat ID") ;
            process.exit(1) ;
        }

        if(!message) {
            console.error("Missing Telegram message text") ;
            process.exit(1) ;
        }

        try{
            const result = await sendTelegramMessage({
                chatId,
                message,
                botToken : token
            });

            console.log(`Sent Telegram message to chat ID: ${result.chatId}`) ;
            console.log(`Telegram message ID: ${result.messageId}`) ;
        }
        catch(error){
            const detail = error instanceof Error ? error.message : String(error) ;
            console.error(`Telegram API request failed: ${detail}`) ;
            process.exit(1) ;
        }
    })

program.parseAsync(process.agrv) ;

// to start chat with the bot , search your bot name in search bar and start chat with it
// to get the chatId , see the response in: https://api.telegram.org/bot<bot-token>/getUpdates

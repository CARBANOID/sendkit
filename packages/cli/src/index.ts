import { Command } from "commander" ;
import { sendTelegramMessage } from "sendkit-core" ;
import z from 'zod' ; 
import { homedir } from "node:os" ;
import { dirname , join } from "node:path" ;
import {
    existsSync ,
    mkdirSync ,
    readFileSync , 
    writeFileSync
 } from "node:fs";


const program = new Command() ;

// define a configration path where the user is going to store this enviroment keys
const configPath = join(homedir(),".config","sendkit","config.json") ;
const cliConfigSchema = z.object({
    telegramBotToken : z.string().min(1).optional() ,
})

function writeTelegramBotToken(token : string){
    mkdirSync(dirname(configPath), {recursive : true}) ;
    writeFileSync(configPath,`${JSON.stringify({ telegramBotToken : token }, null, 2)}\n`,{
        mode : 0o600 ,  // specific to unix operating system
    })
}

function getTelegramBotToken(){
    if(!existsSync(configPath)){
        throw new Error("Telegram Bot Token is required. Run `sendkit init`.")
    }

    const config = cliConfigSchema.parse(JSON.parse(readFileSync(configPath,"utf8"))) ; 
    const token = config.telegramBotToken ;

    if(!token){
        throw new Error("Telegram Bot Token is required. Run `sendkit init`.")
    }

    return token ;
};

program
    .name("sendkit")
    .description("SendKit CLI backed by sendkit-core") ;

program.
    command("init")
    .description("Configure SendKit CLI local settings")
    .requiredOption("--telegram-bot-token <botToken>","Telegram bot Token")  // --telegram-bot-token converts to telegramBotToken ( CamelCase)
    .action(async (options : { telegramBotToken : string }) =>{
        writeTelegramBotToken(options.telegramBotToken) ;
        console.log(`Saved SendKit CLI config to ${configPath}`) ;
    })

program
    .command("telegram")   // name of tool
    .description("Send a Telegram message")
    .argument("<chatId>","Telegram chat ID")  // 1st argument
    .argument("<message>","Message text to send") // 2nd argument
    .action(async(chatId : string,message : string) => { // argument (chatId: string, message: string) are extracted in order of their defination // their variable name does not matter
        const result = await sendTelegramMessage({
            chatId,
            message,
            botToken : getTelegramBotToken()
        });
        
        console.log(JSON.stringify(result)) ;  // for agents
    })

await program.parseAsync(process.argv).catch((error : unknown) => {
    console.error(error instanceof Error ? error.message : String(error)) ;
    process.exitCode = 1 ;
}) ;

// to start chat with the bot , search your bot name in search bar and start chat with it
// to get the chatId , see the response in: https://api.telegram.org/bot<bot-token>/getUpdates

### Configurations (Initial)

* **package.json** 

    ```json
    {
        "name" : "sendkit-workspace",
        "private" : true,
        "type": "module",
        "workspaces": ["packages/*"]
    }
    ```

* **tsconfig.json** 

    ```json
    {
        "compilerOptions": {
            "target": "es2022",
            "module": "esnext",
            "moduleResolution": "bundler",
            "strict": true,
            "types": ["node"],
            "skipLibCheck": true
        }
    }
    ```

* create a **packages/cli/package.json** file with the following content:

    ```json
    {
        "name" : "sendkit",
        "version": "0.0.0",
        "private" : true,
        "type": "module"
    }
    ```

 * **run this command in the root directory**

    ```sh
    bun install
    ```

* **go to packages/cli and run these command**  

    * to create `cli`
        ```sh
        bun add commander
        ```
    * add the node types    
        ```sh
        bun add -d @types/node
        ```

### Creating a Basic CLI

* create a basic `cli` using commander : [index.ts](/packages/cli/src/index.ts)
* run this cli using command   
   
    ```sh 
    bun run dev:cli telegram <chatId> <message>
    ```

    eg : 
    ```sh 
    bun run dev:cli telegram "3123123" "hello world"
    ```

* creating **Telegram Bot**
    - go to search bar in telegram desktop
    - type `BotFather`

* create a shared package called [`core`](packages/core)  

    ```json
    {
        "name": "sendkit-core",
        "version": "0.0.0",
        "private": true,
        "type": "module",
    }
    ```

* add zod package
    ```sh
    bun add zod
    ```

---

### How to import the package developed locally (not published in npm) in a monorepo 

* open package.json of the package where you want to use the local package and add the following line in dependencies section

    ```json
    dependencies: {
    "package-name":"workspace:*"
    }
    ```

    * For example : here we are using `sendkit-core` package in `sendkit-cli` package. So we will add the following line in `sendkit-cli/package.json` file .

        [package.json](packages/cli/package.json)
        ```json
        {
            "dependencies": {
                "sendkit-core": "workspace:*"
            }
        }
        ```

* go to root directory and do 

    ```sh
    bun install
    ```

* go the `sendkit-core` package , create a `index.ts` in src folder and export every modules from it 

    ```ts
    export * from "./schemas" ; 
    export * from "./operations" ;
    ```

* then open it's `package.json` file and add 

    ```json
    {
        "exports" : {
            "." : "./src/index.ts"
        }
    }
    ```

* then import it in `sendkit-cli` package

    ```ts
    import { sendTelegramMessage } from "sendkit-core" ;
    ```

### Local MCP  
* Primarily meant to be run by the local agents (agent running on your machine) .
* It is not deployed anywhere instead it uses standard input and output transport (stdin/stdout) which can run anywhere

### Creating a Local MCP 

* package.json configration  
    ```json
    {
        "name": "sendkit-mcp",
        "version": "0.0.0",
        "private": true,
        "type": "module"
    }
    ```

* Add MCP TypeScript SDK `v1` package : [https://ts.sdk.modelcontextprotocol.io/](https://ts.sdk.modelcontextprotocol.io/)

    Git : [https://github.com/modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)  

    * go inside `packages/local-mcp` and run 
        ```sh
        bun add @modelcontextprotocol/sdk zod
        ```
    
    * add `sendkit-mcp` package as dependency in `local-mcp/package.json` file

        ```json
        {
            "dependencies": {
                "sendkit-mcp": "workspace:*"
            }
        }
        ```
    
    * add node types also as dev dependency

        ```
            bun add -d @types/node
        ```

    * go to [index.ts](packages/local-mcp/src/index.ts) and create a mcp server 


        ### To grant your local agents such as `claude-cli` or `opencode`

        * create a fle name `.mcp.json` in your root directort 

            ```json
                {
                    "mcpServers" : {
                        "sendkit" : {
                            "type" : "stdio",
                            "command" : "bun",
                            "args" : ["run","dev:local-mcp"],
                            "env" : {
                                "TELEGRAM_BOT_TOKEN" : " <bot-token>"
                            }
                        }
                    }
                }
            ```
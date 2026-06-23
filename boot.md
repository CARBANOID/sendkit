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
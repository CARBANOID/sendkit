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
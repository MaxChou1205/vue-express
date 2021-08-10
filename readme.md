# 概述

待補

# 環境

### [後端](https://e-commerce-admin-vue.vercel.app/)

### [前端](https://e-commerce-admin-vue-two.vercel.app/)

# 部署

1. 安裝 cli  
   `npm i -g vercel`

2. 新增 `vercel.json`

   ```
   {
    "version": 2,
    "builds": [
        {
        "src": "./index.js",
        "use": "@vercel/node"
        }
    ],
    "routes": [
        {
        "src": "/(.*)",
        "dest": "/"
        }
    ]
   }
   ```

3. command line 輸入 `vercel` 建置 vercel 專案
4. 未來只要輸入`vercel` 或 `vercel --prod` 就能夠部署

[參考](https://dev.to/hte305/deploy-express-js-app-to-vercel-38jb)

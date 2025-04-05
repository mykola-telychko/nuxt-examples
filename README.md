# nuxt-examples

try nuxt

# create 
npx nuxi init nuxt-app
cd nuxt-app

npm install # or
yarn install # or
pnpm install

npm run dev

http://localhost:3000/api/hi

npm install mysql2

# nuxt-app/server/utils
mk dir utils 

touch db.js
code db.ts

mkdir server/api/products.js

# create / add 
my-nuxt-app/
├── .nuxt/
├── components/
├── layouts/
├── pages/       <-- view
│   └── test.vue
    └── add-product.vue  <-- view
├── public/
├── server/
├── app.vue
├── nuxt.config.js (or nuxt.config.ts)
└── package.json

mkdir pages
cd pages
touch add-product.vue

<!-- add to app.vue -->
<template>
  <div>
    <NuxtPage />
  </div>
</template>

http://localhost:3000/test
http://localhost:3000/add-product
http://localhost:3000/api/products
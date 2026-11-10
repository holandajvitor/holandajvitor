<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3a3a3a,100:000000&height=180&section=header&text=Vitor%20Holanda&fontColor=ffffff&fontSize=46&fontAlignY=36&desc=Software%20Engineer&descAlignY=58&descSize=18" width="100%" alt="Vitor Holanda, Software Engineer" />

<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=20&pause=1200&color=D4D4D4&center=true&vCenter=true&width=560&lines=Hi%2C+I'm+Vitor+%F0%9F%91%8B;Software+Engineer+building+with+TypeScript;Shipping+to+production%2C+not+just+localhost" alt="Typing SVG" /></a>

<p>
  <a href="https://www.linkedin.com/in/jo%C3%A3o-vitor-freitas-holanda-05232b275/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="https://www.instagram.com/hlndjv/"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" /></a>
  <a href="mailto:holandajvitor@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
</p>

</div>

## 👨‍💻 About me

- Software Engineer from Brazil, graduated in **Systems Analysis and Development** and studying **Software Engineering**

- Built **Stockly**, a multi-tenant inventory management SaaS, now live in production

- Currently building **Brillare**, a full e-commerce platform with a storefront, an owner's dashboard and a mobile app, in a TypeScript monorepo with Next.js, Express 5 and PostgreSQL

- I like typed APIs, clean architecture and interfaces that feel good to use

- Learning more about payments integration, end-to-end testing and monorepo tooling

- Ask me about **TypeScript**, **React**, **Next.js** and **Node.js**

## 🛠️ Tech stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=ts,nodejs,react,nextjs,express,vite,tailwind,mongodb,postgres,prisma,docker,aws,githubactions,vitest,pnpm,git&perline=8" alt="TypeScript, Node.js, React, Next.js, Express, Vite, Tailwind CSS, MongoDB, PostgreSQL, Prisma, Docker, AWS, GitHub Actions, Vitest, pnpm, Git" />
  <br />
  <sub>TypeScript · Node.js · React · Next.js · Express · Vite · Tailwind CSS · MongoDB · PostgreSQL · Prisma · Zod · Docker · AWS · CI/CD with GitHub Actions · Vitest · Playwright · pnpm + Turborepo · Git</sub>
</p>

## 🚀 Featured projects

<table>
  <tr>
    <td>
      <h3>📦 <a href="https://stockly.holandajvitor.workers.dev">Stockly</a>: inventory & sales management SaaS</h3>
      <p>A multi-tenant SaaS for small businesses to manage products, categories, sales and their team, with every company's data isolated from the others. Live in production.</p>
      <a href="https://stockly.holandajvitor.workers.dev">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/holandajvitor/holandajvitor/main/assets/stockly-reports-dark.png" />
          <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/holandajvitor/holandajvitor/main/assets/stockly-reports-light.png" />
          <img width="100%" src="https://raw.githubusercontent.com/holandajvitor/holandajvitor/main/assets/stockly-reports-dark.png" alt="Stockly reports page with revenue, average ticket, daily sales chart and best-selling products for a demo store" />
        </picture>
      </a>
      <p align="center"><sub>Reports page with demo data</sub></p>
      <ul>
        <li>🔐 JWT authentication with roles (admin and seller), rate limiting and hardened headers</li>
        <li>🏢 Multi-tenant data isolation enforced at the repository layer</li>
        <li>⚡ Real-time notifications over WebSockets</li>
        <li>📊 Sales reports with charts and PDF/Excel export</li>
        <li>💳 Subscription flow with trial and premium plans</li>
        <li>🧪 Unit and integration tests (Jest, Supertest) plus E2E with Playwright</li>
        <li>🐳 Dockerized API, with type check, tests and image build on every push via GitHub Actions</li>
      </ul>
      <p>
        <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
        <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
        <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
        <img src="https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="React Query" />
        <img src="https://img.shields.io/badge/styled--components-DB7093?style=flat-square&logo=styledcomponents&logoColor=white" alt="styled-components" />
        <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
        <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
        <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
        <img src="https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socketdotio&logoColor=white" alt="Socket.IO" />
        <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
      </p>
      <p><a href="https://stockly.holandajvitor.workers.dev"><img src="https://img.shields.io/badge/Live_demo-stockly.holandajvitor.workers.dev-1f1f1f?style=for-the-badge&logo=cloudflare&logoColor=white&labelColor=000000" alt="Live demo" /></a></p>
      <sub>🔒 Private repository · Frontend on Cloudflare Workers · API on Render · Database on MongoDB Atlas</sub>
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>
      <h3>✦ Brillare: e-commerce platform <sub>(in progress)</sub></h3>
      <p>An online store for religious articles and gifts: a responsive storefront, a separate dashboard for the store owner and, next, a mobile app for shoppers. Built as a pnpm + Turborepo monorepo with shared contracts, design tokens and UI between every app.</p>
      <ul>
        <li>🛍️ Storefront and owner's dashboard in Next.js (App Router) with Tailwind CSS v4 and Radix UI</li>
        <li>🧩 REST API in Express 5 with Prisma and PostgreSQL, layered into controllers, services and repositories</li>
        <li>📐 Shared Zod schemas and a typed API client, so the API and the fronts speak the same contracts</li>
        <li>💳 Checkout with Mercado Pago (PIX, card, boleto), signed webhooks and idempotent orders</li>
        <li>📦 Shipping quotes with Melhor Envio, product photos on Cloudinary and transactional e-mails</li>
        <li>🔒 Atomic stock reservation, so the last unit is never sold twice</li>
        <li>🧪 Vitest unit tests, integration tests on a real PostgreSQL with Testcontainers, and E2E with Playwright, axe and Lighthouse</li>
        <li>🚫 Strict TypeScript with zero <code>any</code>, enforced by ESLint and by CI on every push</li>
      </ul>
      <p>
        <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
        <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
        <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
        <img src="https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="React Query" />
        <img src="https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white" alt="Express 5" />
        <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
        <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
        <img src="https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white" alt="Zod" />
        <img src="https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest" />
        <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white" alt="Playwright" />
        <img src="https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white" alt="Turborepo" />
        <img src="https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm" />
      </p>
      <sub>🔒 Private repository · Mercado Pago · Melhor Envio · Cloudinary · Docker for local PostgreSQL and Mailpit</sub>
    </td>
  </tr>
</table>

## 📊 GitHub stats

<div align="center">
  <img width="100%" src="https://raw.githubusercontent.com/holandajvitor/holandajvitor/output/contributions.svg" alt="Contributions in the last year" />
  <br />
  <img width="49%" src="https://raw.githubusercontent.com/holandajvitor/holandajvitor/output/stats.svg" alt="GitHub stats" />
  <img width="49%" src="https://raw.githubusercontent.com/holandajvitor/holandajvitor/output/commits-by-hour.svg" alt="Commits by hour of the day" />
</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:000000,100:3a3a3a&height=100&section=footer" width="100%" alt="" />

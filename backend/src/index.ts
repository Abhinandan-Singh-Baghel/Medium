import { Hono } from 'hono'


import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>()

const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
}).$extends(withAccelerate())



app.post('/api/v1/signup', (c)=>{
  return c.text('signup route');
})



app.post('/api/v1/signin', (c)=>{
  return c.text('signin route');
})



app.get('/api/v1/blog/:id', (c)=>{
  const id = c.req.param('id');
  console.log(id);
  return c.text('get blog route');
})



app.post('/api/v1/blog', (c)=>{
  return c.text('signin route');
})


app.put('/api/v1/blog', (c)=>{
  return c.text('signin route');
})



export default app

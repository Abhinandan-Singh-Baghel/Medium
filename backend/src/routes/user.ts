import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

import { decode, sign, verify } from 'hono/jwt'
import { signinInput , signupInput  } from '@asbaghel23/common/dist';



export const userRouter = new Hono<{
    Bindings: {
       DATABASE_URL: string,
      JWT_SECRET: string,
    }
  }>();


userRouter.post('/signup', async (c)=>{
    // return c.text('signup route');
  
    const prisma = new PrismaClient({
      
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const body = await c.req.json();

    // do the zod validation

    const { success } = signupInput.safeParse(body);
    if(!success){
      c.status(400);
      return c.json({ error: "Invalid Input" });
    }
  
    try{
  
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password
        }
      });
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.json({ jwt });
    } catch(e) {
      c.status(403);
      return c.json({ error: "error while signing up "});
    }
    
  
  
  })
  
  
  
  userRouter.post('/signin', async (c)=>{
    
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL , 
    }).$extends(withAccelerate());
  
    const body = await c.req.json();

    // do the zod validation

    const { success } = signinInput.safeParse(body);
    if(!success){
      c.status(400);
      return c.json({ error: "invalid input "});
    }


    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password
      }
    });
  
    if( !user ){
      c.status(403);
      return c.json({ error: "user not found "});
    }
  
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  
  })
  
  




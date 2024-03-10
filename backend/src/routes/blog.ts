import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { decode, sign, verify } from 'hono/jwt'
// import { signinInput , signupInput , createPostInput, updatePostInput } from '@asbaghel23/common';



export const blogRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string,
      JWT_SECRET: string,
    },
    Variables: {
      userId: string
    }
  }>();



blogRouter.use('/*', async (c, next) => {
  const jwt = c.req.header('Authorization');
  
  if(!jwt){
    c.status(401);
    return c.json({error: "unauthorized"});

  }
  const token = jwt.split(' ')[1];
  const payload = await verify(token, c.env.JWT_SECRET);
  if(!payload){
    c.status(401);
    return c.json({error: "unauthorized"});
  }

  c.set('userId', payload.id);
  await next()


})


// route to get a blog


blogRouter.get('/:id', async (c)=>{


  const id = c.req.param('id');
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL , 
  }).$extends(withAccelerate());

  const post = await prisma.post.findUnique({
    where: {
      id
    }
  });

  return c.json(post);

  })
  
  
// route to initialize a blog/post


  blogRouter.post('/', async (c)=>{
    
    const userId = c.get('userId');
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL ,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId
      }
    });
    return c.json({
      id: post.id
    });

  })
  

  // route to update blog
  
  blogRouter.put('/', async (c)=>{

    const userId = c.get('userId');
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL , 
    }).$extends(withAccelerate());

    const body = await c.req.json();
    prisma.post.update({
      where: {
        id: body.id,
        authorId: userId
      },
      data: {
        title: body.title,
        content: body.content
      }
    })
return c.text('updated post');


  })
  

// route to get all the posts 


  // blogRouter.get('/bulk', async (c) => {
  //   const prisma = new PrismaClient({
  //     datasourceUrl: c.env?.DATABASE_URL ,
  //   }).$extends(withAccelerate());

  //   const posts = await prisma.post.find({});

  //   return c.json(posts);
  // })
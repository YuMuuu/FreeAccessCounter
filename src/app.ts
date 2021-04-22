import { serve } from 'https://deno.land/std@0.94.0/http/server.ts'

const s =  serve({ port: 8080 })

console.log("---server start---")

for await (const req of s) {
    req.respond({ body: 'Hello World\n' })
  }
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
test('Hostinger can require the ESM server entry without top-level await',async()=>{
 const child=spawn(process.execPath,['--input-type=commonjs','-e',"require('./server.js')"],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:'0',HOST:'127.0.0.1'},stdio:['ignore','pipe','pipe']});
 let output='';let errors='';child.stderr.on('data',x=>{errors+=x;});
 try{await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Server startup timed out: '+errors)),10000);child.stdout.on('data',x=>{output+=x;if(output.includes('Denver Afterhours listening')){clearTimeout(timer);resolve();}});child.on('exit',code=>{clearTimeout(timer);reject(new Error('Server exited '+code+': '+errors));});});assert.match(output,/Denver Afterhours listening/);assert.doesNotMatch(errors,/ERR_REQUIRE_ASYNC_MODULE/);}finally{child.kill('SIGTERM');}
});

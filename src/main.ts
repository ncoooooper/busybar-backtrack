import {surface,label,panel,read,persist,wrap,mint,amber,report,type Frame,type Key} from "@shared/surface";
import {loadValues} from "@shared/settings";

const defaults=[["Build","Run the next test"],["Review","Read the open change"],["Write","Finish the next paragraph"]];
let contexts=defaults,selected=read("selected",0),ready=false;
type Bookmark={at:number; next:string; name:string};
let saved=read<Record<string,Bookmark>>("bookmarks",{}), notice="";
function words(line:string):string[]{
 const lines:string[]=[];let rest=line;
 while(rest&&lines.length<3){let end=rest.length<=26?rest.length:rest.lastIndexOf(" ",26);if(end<=0)end=26;lines.push(rest.slice(0,end));rest=rest.slice(end).trim();}
 return lines;
}
function draw():Frame{
 const mark=saved[selected], name=mark?.name||contexts[selected][0], next=mark?.next||contexts[selected][1];
 const age=mark?Math.max(0,Math.floor((Date.now()-mark.at)/60000)):0;
 return [label("status",mark?"PARKED "+age+"m":"FOCUS "+(selected+1),0,0,mark?amber:mint,"front","tiny"),
 {id:"name",type:"text",font:"small",text:name,x:0,y:7,width:72,scroll_rate:25},
 ...panel(name,[mark?"Saved next action:":"Next action:",...words(next),notice||(mark?"Parked "+age+" minutes ago":"Click to park this context"),
 mark?"Click: resume / Start: latest":"Wheel: context / Start: latest"])];
}
function input(k:Key){
 if(!ready)return;notice="";
 if(k==="up"||k==="down")selected=wrap(selected+(k==="up"?1:-1),3);
 if(k==="start"){
   const keys=Object.keys(saved).sort((a,b)=>saved[b].at-saved[a].at);
   if(keys.length)selected=Number(keys[0]);else notice="No parked contexts";
 }
 if(k==="ok"){
   if(saved[selected]){
      const next=saved[selected].next;delete saved[selected];notice="Resumed";console.log("resumed",selected,next);
   }else{
      saved[selected]={at:Date.now(),name:contexts[selected][0],next:contexts[selected][1]};
      notice="Bookmark saved";console.log("parked",selected,saved[selected].next);
   }
   persist("bookmarks",saved);
 }
 persist("selected",selected);
}
let stopped=false;
const timer=setInterval(()=>{if(saved[selected])refresh();},60000);
const refresh=surface(draw,input,()=>{stopped=true;clearInterval(timer);});
void loadValues().then(v=>{
 if(stopped)return;
 contexts=defaults.map(([name,next],i)=>[String(v?.["name"+i]||name),String(v?.["next"+i]||next)]);
 ready=true;console.log("restored",selected,saved[selected]?.next||"working");refresh();
}).catch(report);

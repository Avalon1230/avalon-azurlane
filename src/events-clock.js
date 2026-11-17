import {eventCountdown,eventStateSignature} from './events.js';
/** One visible-page timer, with in-place text updates and boundary-only renders. */
export function createEventClock({document,read,onTransition,now=Date.now,setIntervalFn=setInterval,clearIntervalFn=clearInterval}){
  let timer=null,signature=null,scope=null;
  function tick(){
    const state=read();if(!state.active||!state.catalog||document.hidden)return;
    const nextScope=state.scope??state.region??'all';
    if(scope!==nextScope){scope=nextScope;signature=null;}
    const time=now(),next=eventStateSignature(state.catalog,state.region,time);
    if(signature!==null&&signature!==next){signature=next;onTransition();}
    else signature=next;
    for(const node of document.querySelectorAll('[data-event-countdown]')){
      const target=node.dataset.eventCountdown;
      node.textContent=Date.parse(target)<=time?(node.dataset.eventComplete||'Deadline reached'):eventCountdown({kind:'exact',value:target},time);
    }
  }
  function sync(){
    const state=read(),active=state.active&&state.catalog&&!document.hidden;
    if(!active){if(timer!==null)clearIntervalFn(timer);timer=null;if(!state.active)signature=null;return;}
    if(timer===null)timer=setIntervalFn(tick,1000);
    tick();
  }
  function destroy(){if(timer!==null)clearIntervalFn(timer);timer=null;document.removeEventListener('visibilitychange',visibility);}
  function visibility(){sync();if(!document.hidden)tick();}
  document.addEventListener('visibilitychange',visibility);
  return {sync,tick,destroy};
}

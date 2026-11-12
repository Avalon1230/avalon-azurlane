/** Session-only assumptions reset when the active ship, slot or mode changes. */
export function createCombatScenario(){
  let key=null,context={};
  return {select(ship,slot,mode){
    const next=JSON.stringify([ship,slot,mode]);
    if(next!==key){key=next;context={};}
    return context;
  }};
}

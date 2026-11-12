/** Preserve the player's place when the app refreshes an open R&D dialog. */
export function captureResearchDialog(document) {
  const dialog=document.getElementById('research-dialog');
  if(!dialog)return null;
  const controls=[...dialog.querySelectorAll('button,input,select,summary,a[href]')];
  return {scroll:dialog.querySelector('.research-dialog-body')?.scrollTop||0,
    focusIndex:controls.indexOf(document.activeElement),
    date:dialog.querySelector('#research-start-date')?.value||'',
    openDetails:[...dialog.querySelectorAll('details')].map(el=>el.open)};
}
export function restoreResearchDialog(document,snapshot) {
  const dialog=document.getElementById('research-dialog');if(!dialog)return;
  if(!snapshot){dialog.focus({preventScroll:true});return;}
  const input=dialog.querySelector('#research-start-date');if(input)input.value=snapshot.date;
  [...dialog.querySelectorAll('details')].forEach((el,i)=>{el.open=Boolean(snapshot.openDetails[i]);});
  const control=[...dialog.querySelectorAll('button,input,select,summary,a[href]')][snapshot.focusIndex];
  (control||dialog).focus({preventScroll:true});
  const body=dialog.querySelector('.research-dialog-body');if(body)body.scrollTop=snapshot.scroll;
}

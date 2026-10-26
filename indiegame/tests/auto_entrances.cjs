// Existing combat checks take the real Skip Scene action as soon as it appears.
// Entrance-specific checks omit this helper and exercise the reading flow itself.
module.exports=async function autoEntrances(context){
 await context.addInitScript(()=>{
  const advance=()=>{const button=document.querySelector('[data-boss-entrance="skip"]');if(button&&!button.disabled)button.click()};
  new MutationObserver(advance).observe(document,{childList:true,subtree:true});
 });
};

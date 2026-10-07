const toggle=document.querySelector("[data-language-toggle]");
let lang=localStorage.getItem("lol-champion-pool:language")==="en"?"en":"pt";
function apply(){
  document.documentElement.lang=lang==="pt"?"pt-BR":"en";
  document.querySelectorAll("[data-lang]").forEach(function(section){section.hidden=section.dataset.lang!==lang;});
  if(toggle)toggle.textContent=lang==="pt"?"EN":"PT-BR";
  localStorage.setItem("lol-champion-pool:language",lang);
}
if(toggle)toggle.addEventListener("click",function(){lang=lang==="pt"?"en":"pt";apply();});
apply();
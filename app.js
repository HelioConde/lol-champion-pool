const RECENT_KEY="lol-champion-pool:recent:v1";
const POOL_KEY="lol-champion-pool:saved:v1";
const LANGUAGE_KEY="lol-champion-pool:language";

const ui={
  pt:{
    eyebrow:"LEAGUE OF LEGENDS · POOL PESSOAL",
    heroTitle:'Menos “qual campeão é meta?”. <span>Mais “com quem eu realmente jogo?”.</span>',
    heroText:"Use seu histórico recente para descobrir quais campeões já fazem parte do seu jogo, em quais funções aparecem e quais escolhas merecem formar seu pool principal.",
    riotId:"Riot ID",server:"Servidor",analyze:"Montar meu pool",privacy:"Consulta pública via backend gamer. Nenhuma chave Riot fica no navegador.",recent:"Buscas recentes",
    poolLogic:"COMO O POOL É LIDO",logic1:"Familiaridade",logic1Text:"Quantas partidas recentes você realmente jogou.",logic2:"Função",logic2Text:"Onde cada campeão aparece no seu histórico.",logic3:"Sinal de desempenho",logic3Text:"KDA e resultados da amostra, sem prometer winrate futuro.",
    loadingTitle:"Lendo suas partidas recentes…",loadingText:"A primeira consulta pode usar cache e carregar partidas em etapas.",analysis:"SEU POOL RECENTE",all:"Todos",
    sampleGames:"Partidas",sampleGamesHelp:"amostra analisada",uniqueChamps:"Campeões",uniqueChampsHelp:"escolhas diferentes",mainRole:"Função principal",mainRoleHelp:"mais frequente",poolSize:"Pool salvo",poolSizeHelp:"máximo recomendado no MVP",
    suggestedEyebrow:"HISTÓRICO RECENTE",suggestedTitle:"Campeões que já fazem parte do seu jogo",sortSignal:"Sinal",sortGames:"Partidas",myPoolEyebrow:"MEU POOL",myPoolTitle:"Até 5 escolhas para focar",clearPool:"Limpar",
    ad:"PUBLICIDADE",adNote:"espaço reservado · fora dos botões do pool",detailEyebrow:"DETALHE",selectChampion:"Escolha um campeão",
    methodEyebrow:"COMO LER",methodTitle:"Pool pessoal não é tier list.",methodText:"O sinal combina volume recente, KDA e resultado na sua própria amostra. Ele ajuda a ordenar familiaridade observável, mas não prevê vitória futura nem substitui matchup, patch, composição ou preferência.",
    riotDisclaimer:"Produto independente. League of Legends e Riot Games são marcas da Riot Games, Inc.",about:"Sobre",privacyLink:"Privacidade",terms:"Termos",
    invalid:"Use um Riot ID no formato Nome#TAG.",loading:"Consultando Riot…",notFound:"Riot ID não encontrado.",rate:"Limite temporário da Riot atingido. Tente novamente em instantes.",error:"Não foi possível consultar os dados Riot agora.",live:"Dados Riot carregados.",
    noSr:"Não há partidas recentes de Summoner's Rift suficientes para montar este pool.",recentNone:"Nenhuma busca recente.",
    sample:function(games,champs){return games+" partidas de Summoner's Rift · "+champs+" campeões observados";},
    games:"partidas",wins:"vitórias",winrate:"Win rate",avgKda:"KDA médio",avgDamage:"Dano/min",roles:"Funções",signal:"Sinal",
    add:"Adicionar ao pool",remove:"Remover do pool",poolFull:"Seu pool já tem 5 campeões.",saved:"Pool atualizado.",cleared:"Pool limpo.",emptyPool:"Seu pool ainda está vazio.",
    coverage:"Cobertura",main:"Principal",secondary:"Secundária"
  },
  en:{
    eyebrow:"LEAGUE OF LEGENDS · PERSONAL POOL",
    heroTitle:'Less “what champion is meta?”. <span>More “who do I actually play?”.</span>',
    heroText:"Use your recent history to see which champions are already part of your game, which roles they appear in and which choices deserve a place in your main pool.",
    riotId:"Riot ID",server:"Server",analyze:"Build my pool",privacy:"Public lookup through the gamer backend. No Riot key is exposed in the browser.",recent:"Recent searches",
    poolLogic:"HOW THE POOL IS READ",logic1:"Familiarity",logic1Text:"How many recent games you actually played.",logic2:"Role",logic2Text:"Where each champion appears in your history.",logic3:"Performance signal",logic3Text:"KDA and results in the sample without promising future win rate.",
    loadingTitle:"Reading your recent matches…",loadingText:"The first lookup may use cache and load matches in stages.",analysis:"YOUR RECENT POOL",all:"All",
    sampleGames:"Games",sampleGamesHelp:"analyzed sample",uniqueChamps:"Champions",uniqueChampsHelp:"different picks",mainRole:"Main role",mainRoleHelp:"most frequent",poolSize:"Saved pool",poolSizeHelp:"recommended max in MVP",
    suggestedEyebrow:"RECENT HISTORY",suggestedTitle:"Champions already part of your game",sortSignal:"Signal",sortGames:"Games",myPoolEyebrow:"MY POOL",myPoolTitle:"Up to 5 picks to focus",clearPool:"Clear",
    ad:"ADVERTISEMENT",adNote:"reserved space · outside pool buttons",detailEyebrow:"DETAIL",selectChampion:"Choose a champion",
    methodEyebrow:"HOW TO READ",methodTitle:"A personal pool is not a tier list.",methodText:"The signal combines recent volume, KDA and results in your own sample. It helps order observable familiarity but does not predict future wins or replace matchup, patch, composition or preference.",
    riotDisclaimer:"Independent product. League of Legends and Riot Games are trademarks of Riot Games, Inc.",about:"About",privacyLink:"Privacy",terms:"Terms",
    invalid:"Use a Riot ID in the Name#TAG format.",loading:"Checking Riot…",notFound:"Riot ID not found.",rate:"Riot rate limit is temporarily active. Try again shortly.",error:"Riot data is unavailable right now.",live:"Riot data loaded.",
    noSr:"There are not enough recent Summoner's Rift matches to build this pool.",recentNone:"No recent searches.",
    sample:function(games,champs){return games+" Summoner's Rift matches · "+champs+" observed champions";},
    games:"games",wins:"wins",winrate:"Win rate",avgKda:"Average KDA",avgDamage:"Damage/min",roles:"Roles",signal:"Signal",
    add:"Add to pool",remove:"Remove from pool",poolFull:"Your pool already has 5 champions.",saved:"Pool updated.",cleared:"Pool cleared.",emptyPool:"Your pool is still empty.",
    coverage:"Coverage",main:"Main",secondary:"Secondary"
  }
};

let lang=localStorage.getItem(LANGUAGE_KEY)==="en"?"en":"pt";
let currentPlayer=null;
let rawMatches=[];
let champions=[];
let activeRole="ALL";
let sortMode="score";
let selectedChampion="";
let toastTimer=null;

function $(selector){return document.querySelector(selector);}
function t(key){return ui[lang][key]||key;}
function esc(value){
  return String(value==null?"":value).replace(/[&<>"']/g,function(char){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char];
  });
}
function parseRiotId(value){
  const raw=String(value||"").trim();
  const split=raw.lastIndexOf("#");
  if(split<=0)return null;
  const gameName=raw.slice(0,split).trim();
  const tagLine=raw.slice(split+1).trim();
  if(!gameName||!tagLine)return null;
  return {gameName:gameName.slice(0,16),tagLine:tagLine.slice(0,6)};
}
function routingFor(platform){
  if(["br1","na1","la1","la2"].includes(platform))return"americas";
  if(["kr","jp1"].includes(platform))return"asia";
  if(["oc1"].includes(platform))return"sea";
  return"europe";
}
function showToast(message){
  const host=document.createElement("div");
  host.className="toast-inline";
  host.textContent=message;
  Object.assign(host.style,{position:"fixed",left:"50%",bottom:"20px",zIndex:"100",transform:"translateX(-50%)",padding:"10px 14px",borderRadius:"999px",background:"#edf8f1",color:"#153025",fontSize:"10px",fontWeight:"800",boxShadow:"0 12px 30px rgba(0,0,0,.25)"});
  document.body.appendChild(host);
  clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){host.remove();},1900);
}
function setStatus(kind,message){
  const host=$("#status");
  host.className="status"+(kind?" "+kind:"");
  host.textContent=message||"";
}
function setLoading(value){
  $("#loading").hidden=!value;
  $("#lookup-form").querySelector("button[type=submit]").disabled=value;
  if(value)setStatus("",t("loading"));
}
function average(items,key){
  if(!items.length)return 0;
  return items.reduce(function(sum,item){return sum+Number(item[key]||0);},0)/items.length;
}
function topEntry(map){
  return Array.from(map.entries()).sort(function(a,b){return b[1]-a[1];})[0]||["—",0];
}
function buildChampions(matches){
  const map=new Map();
  matches.forEach(function(match){
    const name=String(match.champion||"").trim();
    if(!name)return;
    const row=map.get(name)||{name:name,games:0,wins:0,kda:[],damage:[],roles:new Map(),contexts:new Map()};
    row.games++;
    if(match.win)row.wins++;
    row.kda.push(Number(match.kda||0));
    row.damage.push(Number(match.damagePerMin||0));
    if(match.position)row.roles.set(match.position,(row.roles.get(match.position)||0)+1);
    if(match.context)row.contexts.set(match.context,(row.contexts.get(match.context)||0)+1);
    map.set(name,row);
  });
  return Array.from(map.values()).map(function(row){
    const mainRole=topEntry(row.roles)[0];
    const winRate=row.games?Math.round(row.wins/row.games*100):0;
    const avgKda=average(row.kda.map(function(value){return {v:value};}),"v");
    const avgDamage=average(row.damage.map(function(value){return {v:value};}),"v");
    const familiarity=Math.min(1,row.games/15);
    const kdaSignal=Math.min(1,avgKda/5);
    const resultSignal=Math.min(1,Math.max(0,winRate)/100);
    const score=Math.round((familiarity*.55+kdaSignal*.25+resultSignal*.20)*100);
    return {
      name:row.name,games:row.games,wins:row.wins,winRate:winRate,avgKda:avgKda,avgDamage:avgDamage,
      roles:Array.from(row.roles.entries()).sort(function(a,b){return b[1]-a[1];}),
      mainRole:mainRole,score:score
    };
  });
}
function profileKey(){
  if(!currentPlayer)return"default";
  return String(currentPlayer.platform||"").toLowerCase()+":"+String(currentPlayer.gameName||"").toLowerCase()+"#"+String(currentPlayer.tagLine||"").toLowerCase();
}
function readPoolMap(){
  try{
    const parsed=JSON.parse(localStorage.getItem(POOL_KEY)||"{}");
    return parsed&&typeof parsed==="object"&&!Array.isArray(parsed)?parsed:{};
  }catch(error){return{};}
}
function savedPool(){
  const map=readPoolMap();
  const rows=map[profileKey()];
  return Array.isArray(rows)?rows:[];
}
function writePool(names){
  const map=readPoolMap();
  map[profileKey()]=names.slice(0,5);
  localStorage.setItem(POOL_KEY,JSON.stringify(map));
  renderPool();
  renderMetrics();
  renderChampions();
}
function togglePool(name){
  const list=savedPool();
  if(list.includes(name)){
    writePool(list.filter(function(item){return item!==name;}));
    showToast(t("saved"));
    return;
  }
  if(list.length>=5){
    showToast(t("poolFull"));
    return;
  }
  writePool(list.concat(name));
  showToast(t("saved"));
}
function readRecent(){
  try{
    const parsed=JSON.parse(localStorage.getItem(RECENT_KEY)||"[]");
    return Array.isArray(parsed)?parsed.slice(0,5):[];
  }catch(error){return[];}
}
function saveRecent(item){
  const key=item.gameName.toLowerCase()+"#"+item.tagLine.toLowerCase()+"@"+item.platform;
  const next=[item].concat(readRecent().filter(function(row){
    return row.gameName.toLowerCase()+"#"+row.tagLine.toLowerCase()+"@"+row.platform!==key;
  })).slice(0,5);
  localStorage.setItem(RECENT_KEY,JSON.stringify(next));
  renderRecent();
}
function renderRecent(){
  const host=$("#recent-searches");
  const items=readRecent();
  host.innerHTML=items.length?items.map(function(item,index){
    return '<button class="recent-search" type="button" data-recent="'+index+'">'+esc(item.gameName+"#"+item.tagLine)+" · "+esc(item.platform.toUpperCase())+'</button>';
  }).join(""):'<span class="muted">'+esc(t("recentNone"))+'</span>';
}
function filteredChampions(){
  let rows=champions.filter(function(champ){
    return activeRole==="ALL"||champ.roles.some(function(pair){return pair[0]===activeRole;});
  });
  rows=rows.slice().sort(function(a,b){
    if(sortMode==="games")return b.games-a.games||b.score-a.score;
    if(sortMode==="kda")return b.avgKda-a.avgKda||b.games-a.games;
    return b.score-a.score||b.games-a.games;
  });
  return rows;
}
function renderMetrics(){
  $("#metric-games").textContent=rawMatches.length;
  $("#metric-champs").textContent=champions.length;
  const roleMap=new Map();
  rawMatches.forEach(function(match){if(match.position)roleMap.set(match.position,(roleMap.get(match.position)||0)+1);});
  $("#metric-role").textContent=topEntry(roleMap)[0]||"—";
  $("#metric-pool").textContent=savedPool().length+"/5";
  $("#sample-note").textContent=ui[lang].sample(rawMatches.length,champions.length);
}
function renderChampions(){
  const host=$("#champion-grid");
  const rows=filteredChampions();
  const saved=savedPool();
  if(!rows.length){
    host.innerHTML='<div class="detail-content empty">'+esc(t("noSr"))+'</div>';
    return;
  }
  if(!selectedChampion||!rows.some(function(row){return row.name===selectedChampion;}))selectedChampion=rows[0].name;
  host.innerHTML=rows.map(function(champ){
    const pinned=saved.includes(champ.name);
    return '<button class="champion-card '+(champ.name===selectedChampion?"active":"")+'" type="button" data-champion="'+esc(champ.name)+'">'+
      '<div><strong>'+esc(champ.name)+'</strong><span>'+champ.games+' '+esc(t("games"))+' · '+champ.winRate+'% · KDA '+champ.avgKda.toFixed(2)+'</span>'+(pinned?'<div class="pin">★ '+esc(t("myPoolTitle"))+'</div>':'')+'</div>'+
      '<small>'+esc(t("signal"))+' '+champ.score+'</small>'+
      '</button>';
  }).join("");
}
function renderPool(){
  const host=$("#saved-pool");
  const names=savedPool();
  const rows=names.map(function(name){return champions.find(function(champ){return champ.name===name;})||{name:name,mainRole:"—",games:0};});
  if(!rows.length){
    host.innerHTML='<div class="detail-content empty">'+esc(t("emptyPool"))+'</div>';
  }else{
    host.innerHTML=rows.map(function(champ){
      return '<article class="pool-item"><div><strong>'+esc(champ.name)+'</strong><span>'+esc(champ.mainRole||"—")+' · '+champ.games+' '+esc(t("games"))+'</span></div><button type="button" data-remove-pool="'+esc(champ.name)+'">×</button></article>';
    }).join("");
  }
  const roles=["TOP","JUNGLE","MID","ADC","SUPPORT"];
  const covered=new Set(rows.map(function(row){return row.mainRole;}));
  $("#coverage").innerHTML='<span>'+esc(t("coverage"))+'</span>'+roles.map(function(role){
    return '<span class="'+(covered.has(role)?"covered":"")+'">'+role+'</span>';
  }).join("");
}
function renderDetail(){
  const champ=champions.find(function(row){return row.name===selectedChampion;});
  $("#detail-title").textContent=champ?champ.name:t("selectChampion");
  $("#detail-role").textContent=champ?champ.mainRole:"";
  const host=$("#detail-content");
  if(!champ){
    host.className="detail-content empty";
    host.textContent=t("selectChampion");
    return;
  }
  host.className="detail-content";
  const roleText=champ.roles.map(function(pair){return pair[0]+" "+pair[1]+"x";}).join(" · ")||"—";
  const inPool=savedPool().includes(champ.name);
  host.innerHTML=
    '<div class="detail-stat"><span>'+esc(t("games"))+'</span><strong>'+champ.games+'</strong><small>'+champ.wins+' '+esc(t("wins"))+'</small></div>'+
    '<div class="detail-stat"><span>'+esc(t("winrate"))+'</span><strong>'+champ.winRate+'%</strong></div>'+
    '<div class="detail-stat"><span>'+esc(t("avgKda"))+'</span><strong>'+champ.avgKda.toFixed(2)+'</strong></div>'+
    '<div class="detail-stat"><span>'+esc(t("avgDamage"))+'</span><strong>'+Math.round(champ.avgDamage).toLocaleString(lang==="pt"?"pt-BR":"en-US")+'</strong><small>'+esc(roleText)+'</small></div>'+
    '<button class="detail-stat" type="button" data-toggle-pool="'+esc(champ.name)+'"><span>'+esc(t("signal"))+'</span><strong>'+champ.score+'/100</strong><small>'+(inPool?esc(t("remove")):esc(t("add")))+'</small></button>';
}
function render(){
  $("#result").hidden=false;
  $("#player-name").textContent=currentPlayer?currentPlayer.gameName+"#"+currentPlayer.tagLine:"—";
  document.querySelectorAll("[data-role]").forEach(function(button){button.classList.toggle("active",button.dataset.role===activeRole);});
  document.querySelectorAll("[data-sort]").forEach(function(button){button.classList.toggle("active",button.dataset.sort===sortMode);});
  renderMetrics();
  renderChampions();
  renderPool();
  renderDetail();
}
function applyLanguage(){
  document.documentElement.lang=lang==="pt"?"pt-BR":"en";
  document.querySelectorAll("[data-i18n]").forEach(function(element){
    const value=t(element.dataset.i18n);
    if(typeof value==="string"&&value.indexOf("<span>")>=0)element.innerHTML=value;
    else if(typeof value==="string")element.textContent=value;
  });
  $("#language-toggle").textContent=lang==="pt"?"EN":"PT-BR";
  $("#source-pill").textContent=lang==="pt"?"DADOS RIOT":"RIOT DATA";
  localStorage.setItem(LANGUAGE_KEY,lang);
  renderRecent();
  if(currentPlayer)render();
}
function updateUrl(gameName,tagLine,platform){
  const url=new URL(location.href);
  url.searchParams.set("riot",gameName+"#"+tagLine);
  url.searchParams.set("server",platform);
  history.replaceState(null,"",url.pathname+"?"+url.searchParams.toString());
}
async function lookup(gameName,tagLine,platform){
  const endpoint=window.LOL_CHAMPION_POOL_BACKEND&&window.LOL_CHAMPION_POOL_BACKEND.profile;
  if(!endpoint){setStatus("error",t("error"));return;}
  setLoading(true);
  $("#result").hidden=true;
  try{
    const controller=new AbortController();
    const timer=setTimeout(function(){controller.abort();},18000);
    const response=await fetch(endpoint,{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({gameName:gameName,tagLine:tagLine,platform:platform,region:routingFor(platform),limit:100}),
      signal:controller.signal
    });
    clearTimeout(timer);
    const data=await response.json().catch(function(){return{};});
    if(!response.ok||data.error){
      if(response.status===404||data.error==="player")throw{kind:"notFound"};
      if(response.status===429)throw{kind:"rate"};
      throw{kind:"error"};
    }
    currentPlayer=data.player||{gameName:gameName,tagLine:tagLine,platform:platform.toUpperCase()};
    rawMatches=(Array.isArray(data.matches)?data.matches:[]).filter(function(match){
      return match&&match.eligible!==false&&["RANKED","NORMAL"].includes(String(match.context||"").toUpperCase())&&match.position;
    });
    champions=buildChampions(rawMatches);
    selectedChampion="";
    activeRole="ALL";
    sortMode="score";
    saveRecent({gameName:currentPlayer.gameName||gameName,tagLine:currentPlayer.tagLine||tagLine,platform:platform});
    updateUrl(currentPlayer.gameName||gameName,currentPlayer.tagLine||tagLine,platform);
    setStatus("success",t("live"));
    render();
    $("#result").scrollIntoView({behavior:"smooth",block:"start"});
  }catch(error){
    setStatus("error",t(error&&error.kind?error.kind:"error"));
  }finally{
    setLoading(false);
  }
}

$("#lookup-form").addEventListener("submit",function(event){
  event.preventDefault();
  const parsed=parseRiotId($("#riot-id").value);
  if(!parsed){setStatus("error",t("invalid"));$("#riot-id").focus();return;}
  lookup(parsed.gameName,parsed.tagLine,$("#server").value);
});
$("#language-toggle").addEventListener("click",function(){lang=lang==="pt"?"en":"pt";applyLanguage();});
$("#recent-toggle").addEventListener("click",function(){const host=$("#recent-searches");host.hidden=!host.hidden;});
$("#clear-pool").addEventListener("click",function(){writePool([]);showToast(t("cleared"));});

document.addEventListener("click",function(event){
  const recent=event.target.closest("[data-recent]");
  if(recent){
    const item=readRecent()[Number(recent.dataset.recent)];
    if(item){
      $("#riot-id").value=item.gameName+"#"+item.tagLine;
      $("#server").value=item.platform;
      $("#recent-searches").hidden=true;
      lookup(item.gameName,item.tagLine,item.platform);
    }
    return;
  }
  const role=event.target.closest("[data-role]");
  if(role){
    activeRole=role.dataset.role;
    selectedChampion="";
    render();
    return;
  }
  const sort=event.target.closest("[data-sort]");
  if(sort){
    sortMode=sort.dataset.sort;
    render();
    return;
  }
  const champion=event.target.closest("[data-champion]");
  if(champion){
    selectedChampion=champion.dataset.champion;
    renderChampions();
    renderDetail();
    return;
  }
  const toggle=event.target.closest("[data-toggle-pool]");
  if(toggle){
    togglePool(toggle.dataset.togglePool);
    renderDetail();
    return;
  }
  const remove=event.target.closest("[data-remove-pool]");
  if(remove){
    togglePool(remove.dataset.removePool);
    renderDetail();
  }
});

(function boot(){
  applyLanguage();
  renderRecent();
  const params=new URLSearchParams(location.search);
  const parsed=parseRiotId(params.get("riot"));
  const server=String(params.get("server")||"br1").toLowerCase();
  if(parsed){
    $("#riot-id").value=parsed.gameName+"#"+parsed.tagLine;
    if(Array.from($("#server").options).some(function(option){return option.value===server;}))$("#server").value=server;
    lookup(parsed.gameName,parsed.tagLine,server);
  }
})();
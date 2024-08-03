import{d as f,r as A,a as w,o as C,c as N,b as F,e as m,f as u,g as t,n as c,w as h,v as H,h as v,i as g,F as S,j as $,k as j,l as z,t as E,m as L,T as I,p as T,q,_ as B}from"./index-1ct3H5eL.js";import{u as D,s as V,A as G,q as M}from"./stractzApi-DiZL0TF_.js";const l=n=>(T("data-v-334fcc7c"),n=n(),q(),n),P={class:"section_main",style:{"background-image":'url("https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/backgrounds/greyfade.jpg")'}},R={class:"flex flex-col justify-center items-center"},U=l(()=>t("h1",{class:"section_title"}," Escolha o seu herói",-1)),O=l(()=>t("div",{class:"section_desc"},[t("p",null,"Escolha seu herói favorito, conheça as habilidades, atributos e vantagens de cada um. veja informações completa de cada heroi e seus counter heroes com base no meta atual!")],-1)),J={class:"search_container"},K=l(()=>t("h1",null,"Filtrar heróis",-1)),Q={class:"attr_container"},W=l(()=>t("h1",null,"Atributo",-1)),X={class:"filter"},Y={class:"filter_content"},Z=l(()=>t("div",{class:"filter_img",style:{"background-image":'url("https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/search.svg")'}},null,-1)),tt=["src"],et={class:"hidden hero_hover_text group-hover:flex w-full h-8 z-30"},at=["src"],st={class:"hero_text"},rt=l(()=>t("div",{class:"hidden group-hover:flex hero_shadow z-10"},[t("div",{class:"hero_shadow_main hero_shadow_main_content"},[t("div",{class:"hero_shadow_hover",style:{background:"linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.733) 75%, rgb(0, 0, 0) 100%)"}})])],-1)),ot=f({__name:"CounterHeroes",setup(n){const i=A(),p=[{name:"agi",type:"hero_agility"},{name:"str",type:"hero_strength"},{name:"int",type:"hero_intelligence"},{name:"all",type:"hero_universal"}],r=w({search:null,heroes:[],filterAttribute:null}),y=D();C(async()=>{await V.post(G,{query:M}).then(s=>{var o,a;const{heroes:e}=(a=(o=s==null?void 0:s.data)==null?void 0:o.data)==null?void 0:a.constants;console.log("DATA",e),r.heroes=e.sort((k,x)=>k.displayName.localeCompare(x.displayName)),y.SET_ALL_HEROES(r.heroes)}).catch(s=>{console.error("Error:",s)})});const b=s=>{var e;return((e=p.find(o=>o.name===s))==null?void 0:e.type)??""},_=N(()=>{let s=r.heroes;return r.search&&(s=s.filter(e=>r.search.toLowerCase().split(" ").every(o=>e.displayName.toLowerCase().includes(o)))),r.filterAttribute&&(s=s.filter(e=>e.stats.primaryAttribute===r.filterAttribute)),s}),d=s=>{i.value=s.trim(),r.filterAttribute===s?(r.filterAttribute="",i.value=""):r.filterAttribute=s};return(s,e)=>{const o=F("router-link");return m(),u("section",P,[t("div",R,[U,O,t("div",J,[K,t("div",Q,[W,t("div",{onClick:e[0]||(e[0]=a=>d("str")),class:c([i.value==="str"?"toggleFilter":"","attr_image"]),style:{"background-image":'url("https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/herogrid/filter-str-active.png")'}},null,2),t("div",{onClick:e[1]||(e[1]=a=>d("agi")),class:c([i.value==="agi"?"toggleFilter":"","attr_image"]),style:{"background-image":'url("https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/herogrid/filter-agi-active.png")'}},null,2),t("div",{onClick:e[2]||(e[2]=a=>d("int")),class:c([i.value==="int"?"toggleFilter":"","attr_image"]),style:{"background-image":'url("https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/herogrid/filter-int-active.png")'}},null,2),t("div",{onClick:e[3]||(e[3]=a=>d("all")),class:c([i.value==="all"?"toggleFilter":"","attr_image"]),style:{"background-image":'url("https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/herogrid/filter-uni-active.png")'}},null,2)]),t("div",X,[t("div",Y,[Z,t("form",null,[h(t("input",{"onUpdate:modelValue":e[4]||(e[4]=a=>r.search=a),type:"search"},null,512),[[H,r.search]])])])])]),v(I,{name:"heroes",tag:"div",class:c([_.value.length===124?"flex items-center justify-center":"flex items-start justify-start; min-h-[500px]","py-4 md:py-5 flex-wrap mt-6 pb-10 main w-full h-full"])},{default:g(()=>[(m(!0),u(S,null,$(_.value,a=>(m(),j(o,{to:{name:"HeroDetails",params:{id:a.id,name:a.shortName,shortName:a.shortName,displayName:a.displayName,attr:a.stats.primaryAttribute}},class:"group hero_content flex flex-col justify-center items-center shadow-gray-700 transform hover:-translate-y-1 hover:scale-125 hover:z-50 z-10",key:a.id,style:L(`background-image: url("https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/${a.shortName}.png");left: calc(0% + 122px);top: calc(994px);`)},{default:g(()=>[h(t("img",{src:`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/${a.shortName}.png`,alt:"Hero image",class:"w-full"},null,8,tt),[[z,a.id!==6]]),t("div",et,[t("img",{class:"w-7 h-7",src:`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/${b(a.stats.primaryAttribute)}.png`},null,8,at),t("span",st,E(a.displayName),1)]),rt]),_:2},1032,["to","style"]))),128))]),_:1},8,["class"])])])}}}),it=B(ot,[["__scopeId","data-v-334fcc7c"]]),ct=f({__name:"Home",setup(n){return(i,p)=>(m(),u("div",null,[v(it)]))}});export{ct as default};

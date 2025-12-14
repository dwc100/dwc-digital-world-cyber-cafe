/* ---------------- DATABASE ---------------- */
const database = [
  {keywords:["class 9th","class 9","9th"],title:"Class 9th Notes – Full PDF",link:"class9-notes.html",desc:"All Class 9 subjects — Maths, Science, English, Hindi Notes.",size:10240,category:"Class 9"},
   {keywords:["dwc business","dwc project manager","shop manager","project"],title:"dwc business manager",link:"dwcbusiness.html",desc:"all business servicess — manager, data saver, business data protector, dwc business maker.",size:10250,category:"Class 9"},
  {keywords:["DWC","DWC Informeton","what iis dwc","how t use dwc"],title:"full informeton about dwc",link:"aboutdwc.html",desc:"All Informeton dwc— about dwwc, dwc teechnalogy, dwc softwares, dwc Notes.",size:150000,category:"dwc"},
  {keywords:["class 9th chapter 01"],title:"Class 9th Chapter 01 Notes",link:"class9-chapter01.html",desc:"Full explanation notes of Chapter 01.",size:2048,category:"Class 9"},
  {keywords:["class 9th chapter 02"],title:"Class 9th Chapter 02 Notes",link:"class9-chapter02.html",desc:"Detailed notes of Chapter 02.",size:3072,category:"Class 9"},
  {keywords:["class 10th notes"],title:"Class 10th Notes – Full PDF",link:"class10-notes.html",desc:"All Class 10 subjects notes.",size:12288,category:"Class 10"},
  {keywords:["class 9th science"],title:"Class 9th Science Notes",link:"class9-science.html",desc:"Physics, Chemistry & Biology notes.",size:4096,category:"Science"},
  {keywords:["class 9th math"],title:"Class 9th Math Notes",link:"class9-math.html",desc:"NCERT math solutions & notes.",size:2048,category:"Math"},
  {keywords:["what is cell","definition of cell","cell meaning"],title:"Definition of Cell",link:"cell-definition.html",desc:"Explanation of what a cell is in Biology.",size:1024,category:"Science"},
  {keywords:["photosynthesis","what is photosynthesis"],title:"Photosynthesis Notes",link:"photosynthesis.html",desc:"Definition, process, and importance of photosynthesis.",size:2048,category:"Science"},
  {keywords:["what is AI","artificial intelligence"],title:"What is Artificial Intelligence (AI)",link:"ai-notes.html",desc:"Introduction to AI concepts, types, and applications.",size:2048,category:"Technology"},
  {keywords:["everything notes","complete learning material"],title:"Complete Learning Material",link:"all-notes.html",desc:"All subjects and classes notes in one place.",size:51200,category:"All"}
];

/* ---------------- SUGGESTIONS ---------------- */
const suggestionsData = database.map(d=>d.title);
let selectedSuggestion = -1;

function showSuggestions(){
    let input=document.getElementById("mySearch").value.toLowerCase();
    let box=document.getElementById("suggestionBox"); box.innerHTML=""; box.style.display="none"; selectedSuggestion=-1;
    if(input==="") return;
    let filtered=suggestionsData.filter(s=>s.toLowerCase().includes(input));
    filtered.forEach(item=>{
        let div=document.createElement("div");
        div.innerHTML=item.replace(new RegExp(input,"gi"),match=>`<span class="highlight">${match}</span>`);
        div.onclick=()=>{document.getElementById("mySearch").value=item; doSearch();};
        box.appendChild(div);
    });
    if(filtered.length>0) box.style.display="block";
}

document.getElementById("mySearch").addEventListener("keydown",function(event){
    let box=document.getElementById("suggestionBox");
    let items=box.children;
    if(event.key==="ArrowDown"){event.preventDefault(); if(selectedSuggestion<items.length-1){selectedSuggestion++; highlightSuggestion();}}
    if(event.key==="ArrowUp"){event.preventDefault(); if(selectedSuggestion>0){selectedSuggestion--; highlightSuggestion();}}
    if(event.key==="Enter"){event.preventDefault(); if(selectedSuggestion>=0){items[selectedSuggestion].click();} else {doSearch();}}
});
function highlightSuggestion(){let box=document.getElementById("suggestionBox");Array.from(box.children).forEach((c,i)=>c.classList.toggle("active",i===selectedSuggestion));}
function doSearch(){let query=document.getElementById("mySearch").value.trim(); if(query!=="") window.location.href=window.location.pathname+"?q="+encodeURIComponent(query);}

/* ---------------- QUERY ---------------- */
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("q") || "";

// Search box me bhi kuch naa aaye
document.getElementById("mySearch").value = "";

// "Search Results For" ka pura section hide
document.getElementById("searchFor").style.display = "none";

/* ---------------- HELPER FUNCTIONS ---------------- */
function highlightMatch(text,query){return text.replace(new RegExp(query,"gi"),match=>`<span class="highlight">${match}</span>`);}

// Improved fuzzy scoring system
function fuzzyScore(str,query){
    str=str.toLowerCase(); query=query.toLowerCase();
    if(str.includes(query)) return 100;
    let score=0;
    let strWords=str.split(/\s+/);
    let queryWords=query.split(/\s+/);
    queryWords.forEach(qw=>{
        strWords.forEach(sw=>{
            if(sw.startsWith(qw)) score+=15;       // prefix match
            else if(sw.includes(qw)) score+=10;   // partial match
        });
    });
    return score;
}

function computeScore(item,query){
    // Weighted: title > keywords > description
    let titleScore=fuzzyScore(item.title,query)*3;
    let keywordScore=item.keywords.reduce((acc,k)=>acc+fuzzyScore(k,query)*2,0);
    let descScore=fuzzyScore(item.desc,query);
    let sizeScore=item.size/1024; // keep original
    return titleScore + keywordScore + descScore + sizeScore;
}

/* ---------------- CATEGORY FILTER ---------------- */
let categories=[...new Set(database.map(d=>d.category))];
let catContainer=document.getElementById("categoryFilter");
categories.forEach(cat=>{
    let btn=document.createElement("button");
    btn.innerText=cat;
    btn.onclick=()=>{Array.from(catContainer.children).forEach(c=>c.classList.remove("active")); btn.classList.add("active"); showResults(cat);}
    catContainer.appendChild(btn);
});

/* ---------------- DISPLAY RESULTS ---------------- */
let resultArea=document.getElementById("resultsArea");

function showResults(filterCategory=null){
    resultArea.innerHTML="";
    let filtered=database.map(d=>({...d,score:computeScore(d,query)}));
    if(filterCategory) filtered=filtered.filter(d=>d.category===filterCategory);
    filtered.sort((a,b)=>b.score-a.score);
    if(filtered.length === 0) filtered = database.slice(0, 5).map(d=>({...d,score:0}));
    filtered.forEach(res=>{
        let div=document.createElement("div");
        div.className="result-box";
        div.innerHTML=`
            <a class="result-title" href="${res.link}">${highlightMatch(res.title,query)}</a>
            <div class="result-link">${res.link} (Size: ${Math.round(res.size/1024)} KB)</div>
            <div class="result-desc">${highlightMatch(res.desc, query)}</div>
        `;
        resultArea.appendChild(div);
        setTimeout(()=>div.classList.add("show"),100);
    });
}

showResults();

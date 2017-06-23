document.getElementById("testJS").innerHTML="JS is loaded.";
var f='';
addEventListener('keydown', function(e){
    f+=e.key;
    f=f.substr(0,2);
    if(f.toLowerCase()=="bd"&&new Date().toLocaleDateString()=="6/23/2017"){
        alert("And Happy Birthday, Aryan.");
        document.body.innerHTML="HOOPY BARTHDEE!";
    }
})

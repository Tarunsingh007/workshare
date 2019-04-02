var l=4;
// function load(){
//     var divs=document.querySelectorAll("tr");
//     for(let i=l; i<divs.length; i++)
//     {
//         divs[i].style['display']="none";
//     }
// }
// load();
// loadmore=()=>{
//     var divs=document.querySelectorAll("tr");
//     for(let i=l; i<divs.length; i++)
//     {
//         divs[i].style['display']="";
//     }
//     l=l+2;
// }
// console.log(l);
function vote(){
	var l=document.querySelectorAll("#like");
	for(var i=0; i<l.length; i++)
	{
		var s=l[i];
		l[i].addEventListener("click",()=>{
			s.style.disabled="true"},{once:true});
	}
}
vote();
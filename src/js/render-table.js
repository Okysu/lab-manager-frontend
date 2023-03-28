function render_table(){
    const tbody=document.querySelector("tbody.project_area");
    projects.forEach(item=>{
        let tr=document.createElement("tr");
        let td=document.createElement("td");
        td.innerText=item['pname'];
        tr.appendChild(td);
        td=document.createElement("td");
        td.innerText=item['student'];
        tr.appendChild(td);
        td=document.createElement("td");
        td.innerText=item['teacher'];
        tr.appendChild(td);
        td=document.createElement("td");
        td.innerText=item['ptype'];
        tr.appendChild(td);
        tbody.appendChild(tr);
    })
}
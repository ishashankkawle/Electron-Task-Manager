let conf = require('../scripts/config');

module.exports = class Overview_ViewLoader
{
    async parseTaskSectionObject(data , panel_element , list_element)
    {
        let datarows = data["rows"];
        list_element.innerHTML = '';
        
        //----------------------------------------------
        // TASK LIST
        //----------------------------------------------
        for (let index = 0; index < datarows.length; index++) 
        {
            const data_element = datarows[index];
            let node = panel_element.cloneNode(true);

            let title = node.children[0].children[0].children[0];
            let id = node.children[0].children[0].children[1];
            let moduleName = node.children[1].children[0].children[1];
            let priority = node.children[1].children[0].children[0];
            let status = node.children[3].children[1].children[0];
            let endDate = node.children[1].children[0].children[2];
            let description = node.children[2].children[0].children[0];
            let owner = node.children[3].children[0].children[1];
            //let btn_task_complete = node.children[0].children[1].children[1].children[0];
            //let btn_task_inprgss = node.children[0].children[1].children[1].children[1];
            //let btn_task_delete = node.children[0].children[1].children[1].children[2];
            //let btn_task_edit = node.children[0].children[1].children[1].children[4];
            //let context_anchor = node.children[0].children[1].children[0];
            //let context_menu = node.children[0].children[1].children[1];

            title.innerHTML = data_element["Title"];
            moduleName.innerHTML = data_element["Module"];
            priority.innerHTML = data_element["Priority"];
            status.innerHTML = data_element["TaskStatus"];
            endDate = data_element["DateTerminated"];
            description.innerHTML = data_element["Description"];
            owner.innerHTML = data_element["Owner"];

            console.log(conf["TaskTypeToCardColorMap"][data_element["Type"]] + " ----------------> " + data_element["Type"]);
            panel_element.style.borderLeftColor = conf["TaskTypeToCardColorMap"][data_element["Type"]]

            //btn_task_complete.id = "dne"+data_element["TaskId"];
            //btn_task_inprgss.id = "inp"+data_element["TaskId"];
            //btn_task_delete.id = "del"+data_element["TaskId"];
            //btn_task_edit.id = "edt"+data_element["TaskId"];
            //context_anchor.id = "con"+data_element["TaskId"];
            //context_menu.setAttribute('data-toggle-element' , context_anchor.id)

            let listnode = document.createElement("li");
            listnode.appendChild(node);
            list_element.appendChild(listnode);
        }

    }

    async parseSummarySectionObject(data , root_element){
        
    }
}
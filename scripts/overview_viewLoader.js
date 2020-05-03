module.exports = class Overview_ViewLoader
{
    async parseHomeScreenObject(data , panel_element , list_element)
    {
        let datarows = data["rows"];
        list_element.innerHTML = '';
        
        //----------------------------------------------
        // TASK LIST
        //----------------------------------------------
        for (let index = 0; index < datarows.length; index++) 
        {
            const data_element = datarows[index];
            console.log("DATA : " + JSON.stringify(data_element));
            let node = panel_element.cloneNode(true);

            let title = node.children[0].children[0].children[0];
            let moduleName = node.children[0].children[1].children[0];
            let priority = node.children[0].children[1].children[1];
            let order = node.children[0].children[1].children[2];
            let endDate = node.children[0].children[2].children[0];
            let description = node.children[1].children[1];
            let owner = node.children[2].children[1].children[1];
            
            title.innerHTML = data_element["Title"];
            moduleName.innerHTML = data_element["Module"];
            priority.innerHTML = data_element["Priority"];
            order.innerHTML = data_element["Order"];
            endDate = data_element["DateTerminated"];
            description.innerHTML = data_element["Description"];
            owner.innerHTML = data_element["Owner"];

            let listnode = document.createElement("li");
            listnode.appendChild(node);
            list_element.appendChild(listnode);
        }

        //----------------------------------------------
        // COMPLETED TASK
        //----------------------------------------------

    }
}
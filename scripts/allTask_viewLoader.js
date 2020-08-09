const { ipcMain } = require("electron");

module.exports = class AllTasks_ViewLoader
{

    openTask()
    {
        window.open("taskDetail.html")
        // ipc call to new window to pass task_id
    }

    parseSummaryTaskData(data , activeElement , progressElement , completeElement)
    {
        console.log(data);
        
        let actCount =  activeElement.children[0].children[1].children[0]
        let prgCount =  progressElement.children[0].children[1].children[0]
        let cplCount =  completeElement.children[0].children[1].children[0]

        let activeCount = 0;
        let inProgressCount = 0;
        let completedCount = 0;
        for (let index = 0; index < data.length; index++) 
        {
            const element = data[index];
            if(element["TaskStatus"] == "New")
            {
                activeCount++;
            }
            if(element["TaskStatus"] == "In_Progress")
            {
                inProgressCount++;
            }
            if(element["TaskStatus"] == "Completed")
            {
                completedCount++;
            }
        }

        actCount.innerHTML = activeCount;       
        prgCount.innerHTML = inProgressCount;       
        cplCount.innerHTML = completedCount;       
    }

    parseTaskTableData(moduleData , tableElement)
    {
        for (let index = 0; index < moduleData.length; index++) 
        {
            const element = moduleData[index];
            let row = tableElement.insertRow(index);
            row.id = element["TaskId"]

            for (let colIndex = 0; colIndex < 6; colIndex++) 
            {
                let cell = row.insertCell(colIndex);
                if (colIndex == 0) {
                    let listnode = document.createElement("input");
                    listnode.setAttribute("type", "checkbox");
                    listnode.setAttribute("data-role", "checkbox");
                    listnode.setAttribute("value" , row.id)
                    cell.appendChild(listnode);
                }
                else if (colIndex == 1) 
                {
                    cell.innerHTML = element["Module"];
                }
                else if (colIndex == 2)
                {
                    cell.innerHTML = element["Title"];
                }
                else if (colIndex == 3)
                {
                    cell.innerHTML = element["DateTerminated"];
                }
                else if (colIndex == 4)
                {
                    cell.innerHTML = element["TaskStatus"];
                }
                else if (colIndex == 5)
                {
                    cell.innerHTML = element["Owner"];
                }

                if(colIndex !== 0)
                {
                    cell.onclick = this.openTask
                }
            }
        }
    }
}
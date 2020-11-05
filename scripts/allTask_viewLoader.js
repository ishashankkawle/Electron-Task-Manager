const { ipcMain , BrowserWindow } = require("electron");
//require ('handsontable');
//import 'handsontable/dist/handsontable.full.css';


module.exports = class AllTasks_ViewLoader
{

    openTask()
    {
        win = new BrowserWindow({ show:true, frame:true, width: 2000, height: 2000 })

        // and load the index.html of the app.
        win.loadFile('views/taskDetails.html')
        // ipc call to new window to pass task_id
    }

    parseSummaryTaskData(data , activeElement , completeElement , totalElement , slfCompleteElement , slfDeleteElement)
    {
        console.log(data);
        
        let actCount =  activeElement.children[0].children[1].children[1].children[0].children[0]
        let cpmCount =  completeElement.children[0].children[1].children[1].children[0].children[0]
        let totCount =  totalElement.children[0].children[1].children[1].children[0].children[0]
        let slfCmplCount =  slfCompleteElement.children[0].children[1].children[1].children[0].children[0]
        let slfDelCount =  slfDeleteElement.children[0].children[1].children[1].children[0].children[0]

        let activeCount = 0;
        let completedCount = 0;
        let totalCount = data.length;
        let selfCmplCount = 0;
        let selfDelCount = 0;

        for (let index = 0; index < data.length; index++) 
        {
            const element = data[index];
            if(element["TaskStatus"] == "New" || element["TaskStatus"] == "In_Progress")
            {
                activeCount++;
            }
            if(element["TaskStatus"] == "Completed")
            {
                completedCount++;
            }
            if(element["TaskStatus"] == "Self_Completed")
            {
                selfCmplCount++;
            }
            if(element["TaskStatus"] == "Self_Deleted")
            {
                selfDelCount++;
            }
        }

        actCount.innerHTML = activeCount;       
        cpmCount.innerHTML = completedCount;       
        totCount.innerHTML = totalCount;       
        slfCmplCount.innerHTML = selfCmplCount;       
        slfDelCount.innerHTML = selfDelCount;       
    }

    // parseTaskTableData(moduleData , tableElement)
    // {
    //     for (let index = 0; index < moduleData.length; index++) 
    //     {
    //         const element = moduleData[index];
    //         let row = tableElement.insertRow(index);
    //         row.id = element["TaskId"]

    //         for (let colIndex = 0; colIndex < 6; colIndex++) 
    //         {
    //             let cell = row.insertCell(colIndex);
    //             if (colIndex == 0) {
    //                 let listnode = document.createElement("input");
    //                 listnode.setAttribute("type", "checkbox");
    //                 listnode.setAttribute("data-role", "checkbox");
    //                 listnode.setAttribute("value" , row.id)
    //                 cell.appendChild(listnode);
    //             }
    //             else if (colIndex == 1) 
    //             {
    //                 cell.innerHTML = element["Module"];
    //             }
    //             else if (colIndex == 2)
    //             {
    //                 cell.innerHTML = element["Title"];
    //             }
    //             else if (colIndex == 3)
    //             {
    //                 cell.innerHTML = element["DateTerminated"];
    //             }
    //             else if (colIndex == 4)
    //             {
    //                 cell.innerHTML = element["TaskStatus"];
    //             }
    //             else if (colIndex == 5)
    //             {
    //                 cell.innerHTML = element["Owner"];
    //             }

    //             if(colIndex !== 0)
    //             {
    //                 cell.onclick = this.openTask
    //             }
    //         }
    //     }
    // }

    loadDataOnTaskTable( moduleData )
    {
        //@TODO
        //Set DataTable pageLength value dynamically by precalculating using TaskBoard Element size / Window size
        //Get DataTable id as parameter

        let arrDataset = []; 
        let arrFields = ["AssignerName","DateCreated","DateTerminated","Description","Module","Order","OwnerName","Priority","TaskId","TaskStatus","Title","Type"]
        for (let index = 0; index < moduleData.length; index++) 
        {   
            let obj = [];
            const element = moduleData[index];
            for (let index2 = 0; index2 < arrFields.length; index2++) 
            {
                obj.push(element[arrFields[index2]].toString());
            }
            arrDataset.push(obj);
        }
         

        let table = $('#task-board-table').DataTable( {
                data: arrDataset,
                columns: [
                    { title: "Asigned By" },
                    { title: "Start Date" , visible:false},
                    { title: "End Date" },
                    { title: "Description" , visible:false},
                    { title: "Module" },
                    { title: "Order" , visible:false},
                    { title: "Owner" , visible:false},
                    { title: "Priority" , visible:false},
                    { title: "TaskId" , visible:false},
                    { title: "Status" },
                    { title: "Title" },
                    { title: "Type" }
                ],
                "pageLength":7,
                "lengthChange":true,
                "select": {
                    items: 'row'
                },
                "dom" : '<"toolbar">frtip'
            } );

        $("div.toolbar").html('<span onclick="loadUIElement(\'display\' ,\'views/admin\' , \'Admin\')" class="material-icons tsb-table-btn" style="border-left: 0px;">queue</span><span class="material-icons tsb-table-btn">next_plan</span><span class="material-icons tsb-table-btn">pending_actions</span><span class="material-icons tsb-table-btn">auto_delete</span><span class="material-icons tsb-table-btn">refresh</span>');

        console.log("ROWS SELEcTEd : " + table.rows( { selected: true } ).count());
    }
}
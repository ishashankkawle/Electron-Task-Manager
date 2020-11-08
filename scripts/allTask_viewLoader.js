const { ipcMain , BrowserWindow } = require("electron");
let res = require('../shared/resources');

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
            if(element["TaskStatus"] == res["WORKFLOW"]["STR_WF_NEW"] || element["TaskStatus"] == res["WORKFLOW"]["STR_WF_INPROGRESS"])
            {
                activeCount++;
            }
            if(element["TaskStatus"] == res["WORKFLOW"]["STR_WF_COMPLETE"])
            {
                completedCount++;
            }
            if(element["TaskStatus"] == res["WORKFLOW"]["STR_WF_SELFCOMMIT"])
            {
                selfCmplCount++;
            }
            if(element["TaskStatus"] == res["WORKFLOW"]["STR_WF_SELFDELETE"])
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
            if (element["TaskStatus"] == res["WORKFLOW"]["STR_WF_NEW"] || element["TaskStatus"] == res["WORKFLOW"]["STR_WF_INPROGRESS"])
            {
                for (let index2 = 0; index2 < arrFields.length; index2++) 
                {
                    obj.push(element[arrFields[index2]].toString());
                }
                arrDataset.push(obj);
            }
        }
         

        res["TASKDATA_TABLE"] = $('#task-board-table').DataTable( {
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

        $("div.toolbar").html('<span onclick="loadUIElement(\'display\' ,\'views/admin\' , \'Admin\')" class="material-icons tsb-table-btn" style="border-left: 0px;">queue</span><span onclick="operationTrigger(\'tsb_NextTaskWorkflowState\')" class="material-icons tsb-table-btn">next_plan</span><span onclick="operationTrigger(\'tsb_TaskToSelfCommitState\')" class="material-icons tsb-table-btn">pending_actions</span><span onclick="operationTrigger(\'tsb_TaskToSelfDeleteState\')" class="material-icons tsb-table-btn">auto_delete</span><span onclick="loadUIElement(\'display\' ,\'views/taskboard\' , \'All Tasks\')" class="material-icons tsb-table-btn">refresh</span>');

    }
}
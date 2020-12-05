loadMask(1, "loading modules");

let res = require('../shared/resources');
let TaskM = require('../scripts/taskManager');

loadMask(1, "initializing modules");

const taskm = new TaskM();
loadMask(0);

async function operationTrigger_TaskDetails(...args) 
{
    if (args.length == 1) 
    {
        operationSwitch_TaskDetails(args[0]);
    }
    else 
    {
        operationSwitch_TaskDetails(args[0], args[1]);
    }
}

async function operationSwitch_TaskDetails(params, values) 
{
    switch (params) 
    {
        case "base_getAllSelectedTaskData":
            {
                let data = await taskm.getSingleTaskData(res["STR_USERID"] , values);
                console.log(data);
            }
        default:
            break;
    }
}
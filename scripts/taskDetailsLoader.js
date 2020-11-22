function loadTaskDetails()
{
    loadMask(1 , "loading task details");
    ipcRenderer.on('transfer-taskid', (event, arg) => {        
        console.log(arg);
    });
    loadMask(0);
}
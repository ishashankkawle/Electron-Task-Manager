let Util = require('../core/util')

const util = new Util()

module.exports = class TaskDetails_ViewLoader {

    constructor() {
        this.objFieldUpdateStatus = {};
        this.objCurrentTaskDetails = {};
        this.projectMap = {};
        this.userMap = {};
        this.objFieldUpdateStatus["Project"] = {};
        this.objFieldUpdateStatus["Module"] = {};
        this.objFieldUpdateStatus["Type"] = {};
        this.objFieldUpdateStatus["Priority"] = {};
        this.objFieldUpdateStatus["OwnerName"] = {};
    }


    parseTaskInfoSection(data) {
        this.objCurrentTaskDetails = data;
        this.objFieldUpdateStatus["TaskId"] = data["TaskId"]
        let title = document.getElementById("tskd-title");
        let project = document.getElementById("tskd-project");
        let module = document.getElementById("tskd-module");
        let type = document.getElementById("tskd-type");
        let priority = document.getElementById("tskd-priority");
        let status = document.getElementById("tskd-status");
        let assigner = document.getElementById("tskd-assigner");
        let owner = document.getElementById("tskd-owner");
        let description = document.getElementById("tskd-description");
        let id = document.getElementById("tskd-taskid");

        title.innerHTML = data["Title"]
        id.innerHTML = data["TaskId"]
        project.innerHTML = data["Project"]
        module.innerHTML = data["Module"]
        type.innerHTML = data["Type"]
        priority.innerHTML = data["Priority"]
        status.innerHTML = data["TaskStatus"]
        assigner.innerHTML = data["AssignerName"]
        owner.innerHTML = data["OwnerName"]
        description.innerHTML = data["Description"]
    }

    loadProjectDropdown(data) {
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            this.projectMap[element["ProjectId"]] = element["ProjectName"]
        }
        let updatedData = util.createSelectMenuDataObject(data, "ProjectName", "ProjectId");
        let sourceElement = document.getElementById("tskd-mod-project");
        let opt = new Option("select");
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, updatedData);
    }

    loadUserDropdown(data) {
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            this.projectMap[element["UserId"]] = element["Name"]
        }
        let updatedData = util.createSelectMenuDataObject(data, "Name", "UserId");
        let sourceElement = document.getElementById("tskd-mod-owner");
        let opt = new Option("select");
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, updatedData);
    }

    loadModuleDropdown(data) {
        let updatedData = util.createSelectMenuDataObject(data, "Module", "Module");
        let sourceElement = document.getElementById("tskd-mod-module");
        util.removeOptionsFromSelectMenu(sourceElement);
        let opt = new Option("select");
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, updatedData);
    }

    loadTypeDropdown(data) {
        let updatedData = util.createSelectMenuDataObject(data, "Type", "Type");
        let sourceElement = document.getElementById("tskd-mod-type");
        util.removeOptionsFromSelectMenu(sourceElement);
        let opt = new Option("select");
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, updatedData);
    }

    loadPriorityDropdown(data) {
        let updatedData = util.createSelectMenuDataObject(data, "Priority", "Priority");
        let sourceElement = document.getElementById("tskd-mod-priority");
        util.removeOptionsFromSelectMenu(sourceElement);
        let opt = new Option("select");
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, updatedData);
    }

    checkForProjectUpdate(projectId) {
        console.log("CURRENT OBJ = " + JSON.stringify(this.objCurrentTaskDetails))
        if (this.projectMap[projectId] == this.objCurrentTaskDetails["Project"]) {
            this.objFieldUpdateStatus["Project"] = {}
        }
        else {
            this.objFieldUpdateStatus["Project"] = {}
            this.objFieldUpdateStatus["Project"]["OldProject"] = this.objCurrentTaskDetails["Project"];
            this.objFieldUpdateStatus["Project"]["OldProjectId"] = this.objCurrentTaskDetails["ProjectId"];
            this.objFieldUpdateStatus["Project"]["NewProject"] = this.projectMap[projectId];
            this.objFieldUpdateStatus["Project"]["NewProjectId"] = projectId;
        }
        console.log("FINAL OBJ = " + JSON.stringify(this.objFieldUpdateStatus))
    }

    checkForModuleUpdate(module) {
        console.log("CURRENT OBJ = " + JSON.stringify(this.objCurrentTaskDetails))
        if (module == this.objCurrentTaskDetails["Module"]) {
            this.objFieldUpdateStatus["Module"] = {}
        }
        else {
            this.objFieldUpdateStatus["Module"] = {}
            this.objFieldUpdateStatus["Module"]["OldModule"] = this.objCurrentTaskDetails["Module"];
            this.objFieldUpdateStatus["Module"]["NewModule"] = module;
        }
        console.log("FINAL OBJ = " + JSON.stringify(this.objFieldUpdateStatus))
    }

    checkForTypeUpdate(type) {
        console.log("CURRENT OBJ = " + JSON.stringify(this.objCurrentTaskDetails))
        if (type == this.objCurrentTaskDetails["Type"]) {
            this.objFieldUpdateStatus["Type"] = {}
        }
        else {
            this.objFieldUpdateStatus["Type"] = {}
            this.objFieldUpdateStatus["Type"]["OldType"] = this.objCurrentTaskDetails["Type"];
            this.objFieldUpdateStatus["Type"]["NewType"] = type;
        }
        console.log("FINAL OBJ = " + JSON.stringify(this.objFieldUpdateStatus))
    }

    checkForPriorityUpdate(priority) {
        console.log("CURRENT OBJ = " + JSON.stringify(this.objCurrentTaskDetails))
        if (priority == this.objCurrentTaskDetails["Priority"]) {
            this.objFieldUpdateStatus["Priority"] = {}
        }
        else {
            this.objFieldUpdateStatus["Priority"] = {}
            this.objFieldUpdateStatus["Priority"]["OldPriority"] = this.objCurrentTaskDetails["Priority"];
            this.objFieldUpdateStatus["Priority"]["NewPriority"] = priority;
        }
        console.log("FINAL OBJ = " + JSON.stringify(this.objFieldUpdateStatus))
    }

    checkForOwnerUpdate(ownerId) {
        console.log("CURRENT OBJ = " + JSON.stringify(this.objCurrentTaskDetails))
        if (this.userMap[ownerId] == this.objCurrentTaskDetails["OwnerName"]) {
            this.objFieldUpdateStatus["OwnerName"] = {}
        }
        else {
            this.objFieldUpdateStatus["OwnerName"] = {}
            this.objFieldUpdateStatus["OwnerName"]["OldOwner"] = this.objCurrentTaskDetails["OwnerName"];
            this.objFieldUpdateStatus["OwnerName"]["OldOwnerId"] = this.objCurrentTaskDetails["TaskOwner"];
            this.objFieldUpdateStatus["OwnerName"]["NewOwner"] = this.userMap[owner];
            this.objFieldUpdateStatus["OwnerName"]["NewOwnerId"] = ownerId;
        }
        console.log("FINAL OBJ = " + JSON.stringify(this.objFieldUpdateStatus))
    }

    getUpdatedFieldsData()
    {
        return this.objFieldUpdateStatus;
    }


    getCommentListNode(data)
    {
        let listElementHTML = [
            '<div class="col-sm-12">',
            '<small class="text-muted">' + data["userNameBy"] + '</small class="text-muted"><small>&nbsp|&nbsp</small><small class="text-muted">' + data["dateUpdated"]+ '</small>',
            '</div>',
            '<hr class="gen-hr">',
            '<div class="col-sm-12">',
            '<small>' + data["activityData"] + '</small>',
            '</div>',
        ].join("\n");

        let listnode = document.createElement('li')
        listnode.innerHTML = listElementHTML
        listnode.classList.add("tskd-task-card")
        listnode.classList.add("tskd-task-card-comment")
        return listnode;
    }

    getWorkflowListNode(data)
    {
        let listElementHTML = [
            '<div class="col-sm-12">',
            '<small class="text-muted">' + data["userNameBy"] + '</small class="text-muted"><small>&nbsp|&nbsp</small><small class="text-muted">' + data["dateUpdated"]+ '</small>',
            '</div>',
            '<hr class="gen-hr">',
            '<div class="col-sm-12">',
            '<small>Workflow State Change :</small><br />',
            '<div class="col-sm-12">',
            '<small class="badge badge-success">'+ data["prevWorkflowState"] + '</small><i class="material-icons tskd-ico-position-fix">arrow_right_alt</i><small class="badge badge-success">' + data["nextWorkflowState"] + '</small>',
            '</div>',
            '</div>',
        ].join("\n");
  
        let listnode = document.createElement('li')
        listnode.innerHTML = listElementHTML
        listnode.classList.add("tskd-task-card")
        listnode.classList.add("tskd-task-card-alert")
        return listnode;
    }

    getFieldListNode(data , updateType , oldKey , newKey)
    {
        let listElementHTML = [
            '<div class="col-sm-12">',
            '<small class="text-muted">' + data["userNameBy"] + '</small class="text-muted"><small>&nbsp|&nbsp</small><small class="text-muted">' + data["dateUpdated"]+ '</small>',
            '</div>',
            '<hr class="gen-hr">',
            '<div class="col-sm-12">',
            '<small><span class="badge badge-primary">' + updateType + '</span> Update :</small><br />',
            '<div class="col-sm-12">',
            '<small class="badge badge-light">' + data["fieldsUpdated"][updateType][oldKey] + '</small><i class="material-icons tskd-ico-position-fix">arrow_right_alt</i><small class="badge badge-light">' + data["fieldsUpdated"][updateType][newKey] + '</small>',
            '</div>',
            '</div>',
        ].join("\n");
  
        let listnode = document.createElement('li')
        listnode.innerHTML = listElementHTML
        listnode.classList.add("tskd-task-card")
        listnode.classList.add("tskd-task-card-update")
        return listnode;
    }

    parseTaskActivityData(data)
    {
        console.log(data);
        let list = document.getElementById('tskd-activity-list')
        for (let index = 0; index < data.length; index++) 
        {
            const dataItem = data[index];
            let elm;
            if(dataItem["updateType"] == "comment")
            {
                elm = this.getCommentListNode(dataItem) 
                list.appendChild(elm)
            }
            if(dataItem["updateType"] == "workflow")
            {
                elm = this.getWorkflowListNode(dataItem) 
                list.appendChild(elm)
            }
            if(dataItem["updateType"] == "field")
            {
                let fieldsObj = dataItem["fieldsUpdated"];
                console.log(fieldsObj)
                for (var field in fieldsObj) 
                {
                    console.log(field)
                    if (fieldsObj.hasOwnProperty(field)) 
                    {
                        if(field == "Project")
                        {
                            elm = this.getFieldListNode(dataItem , "Project" , "OldProjectName" , "NewProjectName")
                        }
                        if(field == "Module")
                        {
                            console.log(fieldsObj[field])
                            elm = this.getFieldListNode(dataItem , "Module" , "OldModule" , "NewModule")
                        }
                        if(field == "Type")
                        {
                            elm = this.getFieldListNode(dataItem , "Type" , "OldType" , "NewType")
                        }
                        if(field == "Priority")
                        {
                            elm = this.getFieldListNode(dataItem , "Priority" , "OldPriority" , "NewPriority")
                        }
                        if(field == "OwnerName")
                        {
                            elm = this.getFieldListNode(dataItem , "Owner" , "OldOwner" , "NewOwner")
                        }
                        list.appendChild(elm)
                    }
                }
            }
        }
    }
}
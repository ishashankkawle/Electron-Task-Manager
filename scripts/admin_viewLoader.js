let Util = require('../core/util');

const util = new Util();

module.exports = class Admin_ViewLoader
{
    loadProjectListData(data)
    {
        let tableData = util.convertArrayForDataTable(data);

        $('#admin-project-table').DataTable({
            data:tableData,
            columns:[
                {title:"Project List"}
            ],
            searching: false,
            info:false,
            paging:false
        });

    }   

    loadAssetModuleListData(data)
    {
        let tableData = util.convertArrayForDataTable(data);

        if ( $.fn.dataTable.isDataTable( '#admin-asset-module-table' ) ) 
        {
            let table = $('#admin-asset-module-table').DataTable();
            table.clear().draw();
            table.rows.add(tableData); 
            table.columns.adjust().draw();
        }
        else
        {

            $('#admin-asset-module-table').DataTable({
                data:tableData,
                columns:[
                    {title:"Module Id" , visible:false},
                    {title:"Module Name"}
                ],
                searching: false,
                info:false,
                retrieve: true,
                paging:false
            });   
        }
    }   
    loadAssetTypeListData(data)
    {
        let tableData = util.convertArrayForDataTable(data);

        if ( $.fn.dataTable.isDataTable( '#admin-asset-type-table' ) ) {
            let table = $('#admin-asset-type-table').DataTable();
            table.clear().draw();
            table.rows.add(tableData); 
            table.columns.adjust().draw();
        }
        else
        {
            $('#admin-asset-type-table').DataTable({
                data:tableData,
                columns:[
                    {title:"Type Id" , visible:false},
                    {title:"Types"}
                ],
                searching: false,
                info:false,
                retrieve: true,
                paging:false
            });
        }
    }   
    loadAssetPriorityListData(data)
    {
        let tableData = util.convertArrayForDataTable(data);

        if ( $.fn.dataTable.isDataTable( '#admin-asset-priority-table' ) ) {
            let table = $('#admin-asset-priority-table').DataTable();
            table.clear().draw();
            table.rows.add(tableData); 
            table.columns.adjust().draw();
        }
        else
        {

            $('#admin-asset-priority-table').DataTable({
                data:tableData,
                columns:[
                    {title:"Priority Id" , visible:false},
                    {title:"Priorities"}
                ],
                searching: false,
                info:false,
                retrieve: true,
                paging:false
            });   
        }
    }   

    loadUserAssignmentDropdown(sourceData , destinationData)
    {
        let updatedSourceData = util.createSelectMenuDataObject(sourceData , "Name" , "UserId");
        let updatedDestinaionData = util.createSelectMenuDataObject(destinationData , "ProjectName" , "ProjectId");
        let sourceElement = document.getElementById("adm-UsrAsi-Source");
        let destinationElement = document.getElementById("adm-UsrAsi-Target");
        let opt = new Option("select");
        let opt2 = new Option("select");
        sourceElement.add(opt , undefined);
        destinationElement.add(opt2 , undefined);
        util.addOptionsInSelectMenu(sourceElement , updatedSourceData);
        util.addOptionsInSelectMenu(destinationElement , updatedDestinaionData);
    }

    loadTaskProjectDropdown(data)
    {
        let updatedData = util.createSelectMenuDataObject(data , "ProjectName" , "ProjectId");
        let sourceElement = document.getElementById("adm-Tsk-Project");
        let opt = new Option("select");
        sourceElement.add(opt , undefined);
        util.addOptionsInSelectMenu(sourceElement , updatedData);
    }

    loadTaskUserDropdown(data)
    {
        let updatedData = util.createSelectMenuDataObject(data , "Name" , "UserId");
        let sourceElement = document.getElementById("adm-Tsk-Owner");
        util.removeOptionsFromSelectMenu(sourceElement);
        let opt = new Option("select");
        sourceElement.add(opt , undefined);
        util.addOptionsInSelectMenu(sourceElement , updatedData);
    }

    loadUserProjectDropdown(data)
    {
        let updatedData = util.createSelectMenuDataObject(data , "ProjectName" , "ProjectId");
        let sourceElement = document.getElementById("adm-Usr-Project");
        util.addOptionsInSelectMenu(sourceElement , updatedData);
    }


    loadAssetProjectDropdown(data)
    {
        let updatedData = util.createSelectMenuDataObject(data , "ProjectName" , "ProjectId");
        let sourceElement = document.getElementById("adm-Ast-Project");
        let opt = new Option("select");
        sourceElement.add(opt , undefined);
        util.addOptionsInSelectMenu(sourceElement , updatedData);
    }

    loadTaskModuleDropdown(data)
    {
        let updatedData = util.createSelectMenuDataObject(data , "Module" , "Module");
        let sourceElement = document.getElementById("adm-Tsk-Module");
        util.removeOptionsFromSelectMenu(sourceElement);
        let opt = new Option("select");
        sourceElement.add(opt , undefined);
        util.addOptionsInSelectMenu(sourceElement , updatedData);
    }

    loadTaskTypeDropdown(data)
    {
        let updatedData = util.createSelectMenuDataObject(data , "Type" , "Type");
        let sourceElement = document.getElementById("adm-Tsk-Type");
        util.removeOptionsFromSelectMenu(sourceElement);
        let opt = new Option("select");
        sourceElement.add(opt , undefined);
        util.addOptionsInSelectMenu(sourceElement , updatedData);
    }

    loadTaskPriorityDropdown(data)
    {
        let updatedData = util.createSelectMenuDataObject(data , "Priority" , "Priority");
        let sourceElement = document.getElementById("adm-Tsk-Priority");
        util.removeOptionsFromSelectMenu(sourceElement);
        let opt = new Option("select");
        sourceElement.add(opt , undefined);
        util.addOptionsInSelectMenu(sourceElement , updatedData);
    }
}
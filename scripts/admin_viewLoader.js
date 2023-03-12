let Util = require('../core/util');

const util = new Util();

module.exports = class Admin_ViewLoader {
    loadProjectListData(data) {
        data = util.getSubArray(["ProjectName"], data);
        let tableData = util.convertArrayForDataTable(data);
        $('#admin-project-table').DataTable({
            data: tableData,
            columns: [{ title: "Project List" }],
            searching: false,
            info: false,
            paging: false,
            bPaginate: false
        });

    }

    loadAssetModuleListData(data) {
        let tableData = util.convertArrayForDataTable(data);

        if ($.fn.dataTable.isDataTable('#admin-asset-module-table')) {
            let table = $('#admin-asset-module-table').DataTable();
            table.clear().draw();
            table.rows.add(tableData);
            table.columns.adjust().draw();
        }
        else {

            $('#admin-asset-module-table').DataTable({
                data: tableData,
                columns: [
                    { title: "Module Id", visible: false },
                    { title: "Module Name" }
                ],
                searching: false,
                info: false,
                retrieve: true,
                paging: false
            });
        }
    }

    loadAssetTypeListData(data) {
        let tableData = util.convertArrayForDataTable(data);

        if ($.fn.dataTable.isDataTable('#admin-asset-type-table')) {
            let table = $('#admin-asset-type-table').DataTable();
            table.clear().draw();
            table.rows.add(tableData);
            table.columns.adjust().draw();
        }
        else {
            $('#admin-asset-type-table').DataTable({
                data: tableData,
                columns: [
                    { title: "Type Id", visible: false },
                    { title: "Types" }
                ],
                searching: false,
                info: false,
                retrieve: true,
                paging: false
            });
        }
    }

    loadAssetPriorityListData(data) {
        let tableData = util.convertArrayForDataTable(data);

        if ($.fn.dataTable.isDataTable('#admin-asset-priority-table')) {
            let table = $('#admin-asset-priority-table').DataTable();
            table.clear().draw();
            table.rows.add(tableData);
            table.columns.adjust().draw();
        }
        else {

            $('#admin-asset-priority-table').DataTable({
                data: tableData,
                columns: [
                    { title: "Priority Id", visible: false },
                    { title: "Priorities" }
                ],
                searching: false,
                info: false,
                retrieve: true,
                paging: false
            });
        }
    }

    loadRoleData(data) {
        if (data == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let tableData = util.convertArrayForDataTable(data);
        $('#admin-Role-table').DataTable({
            data: tableData,
            columns: [
                { title: "Role" },
                { title: "Securiy Level" }
            ],
            order: [[1, "asc"]],
            searching: false,
            info: false,
            retrieve: true,
            paging: false
        });
    }

    loadUserAssignmentDropdown(sourceData, destinationData) {
        if (sourceData == undefined || destinationData == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let updatedSourceData = util.createSelectMenuDataObject(sourceData, "Name", "UserId");
        let updatedDestinaionData = util.createSelectMenuDataObject(destinationData, "projectName", "projectId");
        let sourceElement = document.getElementById("adm-UsrAsi-Source");
        let sourceElement2 = document.getElementById("adm-UsrDeAsi-Source");
        let destinationElement = document.getElementById("adm-UsrAsi-Target");
        let opt = new Option("select");
        let opt2 = new Option("select");
        let opt3 = new Option("select");
        sourceElement.add(opt, undefined);
        destinationElement.add(opt2, undefined);
        sourceElement2.add(opt3, undefined);
        util.addOptionsInSelectMenu(sourceElement, updatedSourceData);
        util.addOptionsInSelectMenu(sourceElement2, updatedSourceData);
        util.addOptionsInSelectMenu(destinationElement, updatedDestinaionData);
    }

    loadUserRoleDropdown(roleData) {
        if (roleData == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let updatedSourceData = util.createSelectMenuDataObject(roleData, "RoleName", "SecurityLevel");
        let sourceElement = document.getElementById("adm-Usr-Role");
        let opt = new Option("select");
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, updatedSourceData);
    }

    loadUserAssignmentProjDropdown(data) {
        if (data == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let updatedDestinaionData = util.createSelectMenuDataObject(data, "ProjectName", "ProjectId");
        let sourceElement = document.getElementById("adm-UsrDeAsi-Target");
        let opt = new Option("select");
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, updatedDestinaionData);
    }

    loadRoleAssignmentUserDropdown(userData) {
        if (userData == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let SourceData = util.createSelectMenuDataObject(userData, "Name", "UserId");
        let sourceElement = document.getElementById("adm-Rleassign-User");
        let opt = new Option("select");
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, SourceData);
    }

    loadRoleAssignmentRoleDropdown(roleData) {
        if (roleData == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let SourceData = util.createSelectMenuDataObject(roleData, "RoleName", "SecurityLevel");
        let sourceElement = document.getElementById("adm-Rleassign-Role");
        let opt = new Option("select");
        util.removeOptionsFromSelectMenu(sourceElement)
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, SourceData);
    }

    loadTaskProjectDropdown(data) {
        if (data == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let updatedData = util.createSelectMenuDataObject(data, "ProjectName", "ProjectId");
        let sourceElement = document.getElementById("adm-Tsk-Project");
        let opt = new Option("select");
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, updatedData);
    }

    loadTaskUserDropdown(data) {
        if (data == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let updatedData = util.createSelectMenuDataObject(data, "Name", "UserId");
        let sourceElement = document.getElementById("adm-Tsk-Owner");
        util.removeOptionsFromSelectMenu(sourceElement);
        let opt = new Option("select");
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, updatedData);
    }

    loadUserProjectDropdown(data) {
        if (data == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let updatedData = util.createSelectMenuDataObject(data, "ProjectName", "ProjectId");
        let sourceElement = document.getElementById("adm-Usr-Project");
        util.addOptionsInSelectMenu(sourceElement, updatedData);
    }

    loadAssetProjectDropdown(data) {
        if (data == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let updatedData = util.createSelectMenuDataObject(data, "ProjectName", "ProjectId");
        let sourceElement = document.getElementById("adm-Ast-Project");
        let opt = new Option("select");
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, updatedData);
    }

    loadTaskModuleDropdown(data) {
        if (data == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let updatedData = util.createSelectMenuDataObject(data, "Module", "Module");
        let sourceElement = document.getElementById("adm-Tsk-Module");
        util.removeOptionsFromSelectMenu(sourceElement);
        let opt = new Option("select");
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, updatedData);
    }

    loadTaskTypeDropdown(data) {
        if (data == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let updatedData = util.createSelectMenuDataObject(data, "Type", "Type");
        let sourceElement = document.getElementById("adm-Tsk-Type");
        util.removeOptionsFromSelectMenu(sourceElement);
        let opt = new Option("select");
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, updatedData);
    }

    loadTaskPriorityDropdown(data) {
        if (data == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let updatedData = util.createSelectMenuDataObject(data, "Priority", "Priority");
        let sourceElement = document.getElementById("adm-Tsk-Priority");
        util.removeOptionsFromSelectMenu(sourceElement);
        let opt = new Option("select");
        sourceElement.add(opt, undefined);
        util.addOptionsInSelectMenu(sourceElement, updatedData);
    }

    loadProjectUserDeleteDropdown(projectData, userData) {
        if (projectData == undefined || userData == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let prjData = util.createSelectMenuDataObject(projectData, "ProjectName", "ProjectId");
        let usrData = util.createSelectMenuDataObject(userData, "Name", "UserId");
        let projectElement = document.getElementById("adm-accDel-Project");
        let userElement = document.getElementById("adm-accDel-ProjectUser");
        util.removeOptionsFromSelectMenu(projectElement);
        util.removeOptionsFromSelectMenu(userElement);
        let opt = new Option("select");
        let opt2 = new Option("select");
        projectElement.add(opt, undefined);
        userElement.add(opt2, undefined);
        util.addOptionsInSelectMenu(projectElement, prjData);
        util.addOptionsInSelectMenu(userElement, usrData);
    }

    loadTaskUserDeleteDropdown(userData) {
        if (userData == undefined) {
            popupNotification("alert", "ERROR : No data received")
            return;
        }
        let usrData = util.createSelectMenuDataObject(userData, "Name", "UserId");
        let userElement = document.getElementById("adm-accDel-TaskAssigner");
        let userElement2 = document.getElementById("adm-accDel-TaskOwner");
        util.removeOptionsFromSelectMenu(userElement);
        util.removeOptionsFromSelectMenu(userElement2);
        let opt = new Option("select");
        let opt2 = new Option("select");
        userElement.add(opt, undefined);
        userElement2.add(opt2, undefined);
        util.addOptionsInSelectMenu(userElement, usrData);
        util.addOptionsInSelectMenu(userElement2, usrData);
    }
}
let conf = require('../scripts/config');

module.exports = class Overview_ViewLoader {
    async parseTaskSectionObject(data, panel_element, list_element) {
        let datarows = data["rows"];
        list_element.innerHTML = '';
        console.log("Length = " + datarows.length)
        //----------------------------------------------
        // TASK LIST
        //----------------------------------------------
        //for (let index = 0; index < datarows.length; index++) 
        for (let index = 0; index < 3; index++) {
            const data_element = datarows[index];
            let node = panel_element.cloneNode(true);

            let title = node.children[0].children[1].children[0];
            let id = node.children[0].children[1].children[1];
            let moduleName = node.children[0].children[1].children[2].children[0].children[0];
            let priority = node.children[0].children[1].children[2].children[0].children[1];
            let status = node.children[0].children[2].children[0];
            let endDate = node.children[0].children[1].children[2].children[0].children[2];


            title.innerHTML = data_element["Title"];
            moduleName.innerHTML = data_element["Module"];
            priority.innerHTML = data_element["Priority"];
            status.innerHTML = data_element["TaskStatus"];
            endDate = data_element["DateTerminated"];

            //panel_element.style.borderLeftColor = conf["TaskTypeToCardColorMap"][data_element["Type"]]

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

    async parseSummarySectionObject(data, root_element, module_table, perf_chart, mod_occup_chart) 
    {
        let activeTile = root_element.children[0].children[1].children[0].children[0].children[1]
        let completeTile = root_element.children[0].children[1].children[1].children[0].children[1]
        let activeProgressBar = root_element.children[0].children[1].children[0].children[1].children[0].children[0]
        let activeProgressBarValue = root_element.children[0].children[1].children[0].children[1].children[1].children[0]
        let completeProgressBar = root_element.children[0].children[1].children[1].children[1].children[0].children[0]
        let completeProgressBarValue = root_element.children[0].children[1].children[1].children[1].children[1].children[0]

        let totaTaskCount = parseInt(data["total"]);
        let percActive = parseInt(data["active"]) * 100 / totaTaskCount;
        let perComplete = parseInt(data["complete"]) * 100 / totaTaskCount;



        let moduleData = data["ModuleData"];
        let moduleNames = [];
        let moduleCount = [];

        //---------------------------------------------------------------
        // SET ELEMENT DATA
        //---------------------------------------------------------------
        activeTile.innerHTML = data["active"]
        completeTile.innerHTML = data["complete"]
        activeProgressBar.setAttribute("style", "width : " +percActive+"%")
        completeProgressBar.setAttribute("style", "width : "+perComplete+ "%")
        activeProgressBarValue.innerHTML = percActive
        completeProgressBarValue.innerHTML = perComplete

        //---------------------------------------------------------------
        // MODULE FRAGENTATION TABLE
        //---------------------------------------------------------------
        for (let index = 0; index < moduleData.length; index++) {
            const element = moduleData[index];
            let row = module_table.insertRow(index);

            for (let colIndex = 0; colIndex < 3; colIndex++) {
                let cell = row.insertCell(colIndex);
                if (colIndex == 0) {
                    cell.innerHTML = index + 1;
                }
                else if (colIndex == 1) {
                    cell.innerHTML = element["Module"];
                    moduleNames.push(element["Module"])
                }
                else {
                    cell.innerHTML = element["count"];
                    moduleCount.push(element["count"]);
                }
            }
        }



        //---------------------------------------------------------------
        // MODULE FRAGENTATION CHART
        //---------------------------------------------------------------
        var ctx2 = mod_occup_chart.getContext('2d');
        var chart2 = new Chart(ctx2, {
            // The type of chart we want to create
            type: 'doughnut',

            // The data for our dataset
            data: {
                datasets: [{

                    data: moduleCount,
                    backgroundColor: [
                        'rgb(0, 204, 0)',
                        'rgb(255, 153, 0)'
                    ]
                }],

                labels: moduleNames,

            },

            // Configuration options go here
            options: {}
        });

        //---------------------------------------------------------------
        // MONTHLY PERFORMANCE CHART
        //---------------------------------------------------------------
        var ctx = perf_chart.getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                datasets: [{
                    label: 'Monthly Performance',
                    backgroundColor: 'rgb(63, 81, 181)',
                    borderColor: 'rgb(63, 81, 181)',
                    data: [0, 10, 5, 2, 20, 30]
                }]
            },

            // Configuration options go here
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 20
                    }
                }
            }
        });
    }
}
let Util = require('../core/util');
let conf = require('../scripts/config');
const res = require('../shared/resources')

const util = new Util();

module.exports = class Overview_ViewLoader 
{
    async parseTaskSectionObject(datarows, panel_element, list_element) 
    {
        
        list_element.innerHTML = '';
        //----------------------------------------------
        // TASK LIST
        //----------------------------------------------
        //for (let index = 0; index < datarows.length; index++) 

        if( datarows != undefined && datarows.length != 0 )
        {
            toggleDisplayElement('ovr-noData-msg');
            for (let index = 0; index < 3; index++) 
            {
                const data_element = datarows[index];
                if(data_element == undefined)
                {
                    continue;
                }
                if (data_element["TaskStatus"] == res["WORKFLOW"]["STR_WF_INPROGRESS"] || data_element["TaskStatus"] == res["WORKFLOW"]["STR_WF_NEW"]) 
                {
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
                    
                    let listnode = document.createElement("li");
                    listnode.appendChild(node);
                    list_element.appendChild(listnode);
                }
            }   
        }
        else
        {
            toggleDisplayElement('task-list');
        }
    }

    async parseSummarySectionObject(data, root_element , perf_chart, mod_occup_chart) 
    {
        console.log(data);
        let activeTile = root_element.children[0].children[1].children[0].children[0].children[1]
        let completeTile = root_element.children[0].children[1].children[1].children[0].children[1]
        let activeProgressBar = root_element.children[0].children[1].children[0].children[1].children[0].children[0]
        let activeProgressBarValue = root_element.children[0].children[1].children[0].children[1].children[1].children[0]
        let completeProgressBar = root_element.children[0].children[1].children[1].children[1].children[0].children[0]
        let completeProgressBarValue = root_element.children[0].children[1].children[1].children[1].children[1].children[0]

        let totaTaskCount = 0;
        let percActive = 0;
        let perComplete = 0;
        
        if(data["total"] != 0)
        {
            totaTaskCount = Math.round(parseInt(data["total"]));
        }
        if(data["active"] != 0)
        {
            percActive = Math.round(parseInt(data["active"]) * 100 / totaTaskCount);
        }
        if(data["complete"] != 0)
        {
            perComplete = Math.round(parseInt(data["complete"]) * 100 / totaTaskCount);
        }

        let moduleData = data["ModuleData"];
        let moduleNames = [];
        let moduleCount = [];
        let colorArray = [];
        for (let index = 0; index < moduleData.length; index++) 
        {
            const element = moduleData[index];
            moduleNames.push(element["Module"]);
            moduleCount.push(element["count"]);
            colorArray.push(util.getRandomColor());
        }
        moduleData = util.convertArrayForDataTable(moduleData);


        //---------------------------------------------------------------
        // SET ELEMENT DATA
        //---------------------------------------------------------------
        activeTile.innerHTML = data["active"]
        completeTile.innerHTML = data["complete"]
        activeProgressBar.setAttribute("style", "width : " + percActive + "%")
        completeProgressBar.setAttribute("style", "width : " + perComplete + "%")
        activeProgressBarValue.innerHTML = percActive
        completeProgressBarValue.innerHTML = perComplete

        //---------------------------------------------------------------
        // MODULE FRAGENTATION TABLE
        //---------------------------------------------------------------
        $('#ovr-module-frag-table').DataTable({
            data:moduleData,
            columns:[
                {title:"Module"},
                {title:"#"}
            ],
            searching: false,
            info:false,
            lengthChange:false,
            pageLength:3
        });

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
                    backgroundColor: colorArray
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
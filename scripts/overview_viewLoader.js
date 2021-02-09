let Util = require('../core/util')
const res = require('../shared/resources')

const util = new Util()

module.exports = class Overview_ViewLoader {
  async parseTaskSectionObject(datarows, list_element) {
    list_element.innerHTML = ''
    //----------------------------------------------
    // TASK LIST
    //----------------------------------------------
    if (datarows != undefined && datarows.length != 0) 
    {
      toggleDisplayElement('ovr-noData-msg')
      for (let index = 0; index < 3; index++) 
      {
        console.log(datarows)
        const data_element = datarows[index]
        if (data_element == undefined) 
        {
          continue
        }
        if (data_element['TaskStatus'] == res['WORKFLOW']['STR_WF_INPROGRESS'] || data_element['TaskStatus'] == res['WORKFLOW']['STR_WF_NEW']) 
        {
          console.log(data_element)
          data_element["DateTerminated"] = '10-20-2020'

          let listElementHTML = [
          '<div class="row" id="ovr-tsk-panel">',
          '<div class="col-1">',
          '<span class="material-icons" style="font-size: 18px; vertical-align: bottom">build</span>',
          '</div>',
          '<div class="col-2 d-flex">',
          '<div style="font-size: 14px" class="my-auto" id="ovr-tsk-card-date">' + data_element["DateTerminated"] + '</div>',
          '</div>',
          '<div class="col-6 d-flex">',
          '<div style="font-size: 14px" class="my-auto" id="ovr-tsk-card-title">' + data_element["Title"] + '</div>',
          '</div>',
          '<div class="col-2 d-flex">',
          '<div style="font-size: 10px" class="my-auto"><span id="ovr-tsk-card-module">' + data_element["Module"] + '</span>&nbsp|&nbsp<span id="ovr-tsk-card-priority">' + data_element["Priority"] + '</span>',
          '</div>',
          '</div>',
          '<div class="ml-auto col-1">',
          '<div class="dropdown align-self-center text-center">',
          '<button class="btn dropdown-toggle btn-more" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>',
          '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton" style="background: var(--bg3); color: var(--text); font-size: 14px">',
          '<a class="dropdown-item" onClick="operationTrigger(this.id , \'delete_tas\')">Open</a>',
          '<a class="dropdown-item" onClick="operationTrigger(this.id , \'delete_tas\')">In_Progress</a>',
          '<a class="dropdown-item" onClick="operationTrigger(this.id , \'complete_task\')">Self_Commit</a>',
          '<a class="dropdown-item" onClick="operationTrigger(this.id , \'edit_task\')">Self_Delete</a>',
          '</div>',
          '</div>',
          '</div>',
          '</div>',
          ].join("\n");

          let listnode = document.createElement('li')
          listnode.innerHTML = listElementHTML
          list_element.appendChild(listnode)
        }
      }
    } else {
      //toggleDisplayElement('task-list')
    }
  }

  async parseSummarySectionObject(data, root_element, perf_chart, mod_occup_chart) {
    if(Object.keys(data).length === 0)
    {
      popupNotification("alert" , "ERROR : No data received");
      return;
    }
    let activeTile = document.getElementById('overview_active')
    let completeTile = document.getElementById('overview_complete')
    let activeProgressBarValue = document.getElementById('overview_active_percentage')
    let completeProgressBarValue = document.getElementById('overview_complete_percentage')

    let totaTaskCount = 0
    let percActive = 0
    let perComplete = 0
    if(data['active'] == undefined || data['complete'] == undefined)
    {
      data['active'] = 0;
      data['complete'] = 0;
    }

    if (data['total'] != 0 && data['total'] != undefined) {
      totaTaskCount = Math.round(parseInt(data['total']))
    }
    if (data['active'] != 0 && data['active'] != undefined) {
      percActive = Math.round((parseInt(data['active']) * 100) / totaTaskCount)
    }
    if (data['complete'] != 0 && data['complete'] != undefined) {
      perComplete = Math.round((parseInt(data['complete']) * 100) / totaTaskCount)
    }

    let moduleData = {}
    if(data['ModuleData'] != undefined)
    {
      moduleData = data['ModuleData']
    }
    let moduleNames = []
    let moduleCount = []
    let colorArray = []
    for (let index = 0; index < moduleData.length; index++) {
      const element = moduleData[index]
      moduleNames.push(element['Module'])
      moduleCount.push(element['count'])
      colorArray.push(util.getRandomColor())
    }
    moduleData = util.convertArrayForDataTable(moduleData)

    //---------------------------------------------------------------
    // SET ELEMENT DATA
    //---------------------------------------------------------------
    activeTile.innerHTML = data['active']
    completeTile.innerHTML = data['complete']
    activeProgressBarValue.innerHTML = `${percActive}%`
    completeProgressBarValue.innerHTML = `${perComplete}%`

    //---------------------------------------------------------------
    // MODULE FRAGENTATION TABLE
    //---------------------------------------------------------------
    $('#ovr-module-frag-table').DataTable({
      data: moduleData,
      columns: [{ title: 'Module' }, { title: '#' }],
      searching: false,
      info: false,
      lengthChange: false,
      bPaginate: false,
    })

    //---------------------------------------------------------------
    // MODULE FRAGENTATION CHART
    //---------------------------------------------------------------
    var ctx2 = mod_occup_chart.getContext('2d')
    var chart2 = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: moduleCount,
            backgroundColor: colorArray,
          },
        ],
        labels: moduleNames
      },

      // Configuration options go here
      options: {
        responsive: true,
        cutoutPercentage: 70,
        maintainAspectRatio: true,
        elements: {
          arc: {
            borderWidth: 0,
            weight: 4
          }
        },
        legend: {
          labels: {
            fontColor: 'white'
          }
        }
      }
    })

    //---------------------------------------------------------------
    // MONTHLY PERFORMANCE CHART
    //---------------------------------------------------------------
    let ctx = perf_chart.getContext('2d')
    let chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Monthly Performance',
            backgroundColor: '#63bce7',
            borderColor: '#63bce7',
            data: [0, 10, 5, 2, 20, 30],
          },
        ],
      },

      // Configuration options go here
      options: {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: '#ffffff',
                beginAtZero: true,
                fontSize: 14,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                fontColor: '#ffffff',
                beginAtZero: true,
                fontSize: 14,
              },
            },
          ],
        },
        layout: {
          padding: {
            left: 8,
            right: 8,
            top: 8,
            bottom: 20,
          },
        },
      },
    })
  }
}

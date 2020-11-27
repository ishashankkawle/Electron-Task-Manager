let Util = require('../core/util')
let conf = require('../scripts/config')
const res = require('../shared/resources')

const util = new Util()

module.exports = class Overview_ViewLoader {
  async parseTaskSectionObject(datarows, panel_element, list_element) {
    list_element.innerHTML = ''
    //----------------------------------------------
    // TASK LIST
    //----------------------------------------------
    //for (let index = 0; index < datarows.length; index++)

    if (datarows != undefined && datarows.length != 0) {
      toggleDisplayElement('ovr-noData-msg')
      for (let index = 0; index < 3; index++) {
        const data_element = datarows[index]
        if (data_element == undefined) {
          continue
        }
        if (
          data_element['TaskStatus'] == res['WORKFLOW']['STR_WF_INPROGRESS'] ||
          data_element['TaskStatus'] == res['WORKFLOW']['STR_WF_NEW']
        ) {
          let node = panel_element.cloneNode(true)
          let title = document.getElementById('overview_active_percentage')
          let id = document.getElementById('overview_active_percentage')
          let moduleName = document.getElementById('overview_active_percentage')
          let priority = document.getElementById('overview_active_percentage')
          let status = document.getElementById('overview_active_percentage')
          let endDate = document.getElementById('overview_active_percentage')

          title.innerHTML = data_element['Title']
          moduleName.innerHTML = data_element['Module']
          priority.innerHTML = data_element['Priority']
          status.innerHTML = data_element['TaskStatus']
          endDate = data_element['DateTerminated']

          let listnode = document.createElement('li')
          listnode.appendChild(node)
          list_element.appendChild(listnode)
        }
      }
    } else {
      toggleDisplayElement('task-list')
    }
  }

  async parseSummarySectionObject(data, root_element, perf_chart, mod_occup_chart) {
    let activeTile = document.getElementById('overview_active')
    let completeTile = document.getElementById('overview_complete')
    let activeProgressBarValue = document.getElementById('overview_active_percentage')
    let completeProgressBarValue = document.getElementById('overview_complete_percentage')

    let totaTaskCount = 0
    let percActive = 0
    let perComplete = 0

    if (data['total'] != 0) {
      totaTaskCount = Math.round(parseInt(data['total']))
    }
    if (data['active'] != 0) {
      percActive = Math.round((parseInt(data['active']) * 100) / totaTaskCount)
    }
    if (data['complete'] != 0) {
      perComplete = Math.round((parseInt(data['complete']) * 100) / totaTaskCount)
    }

    let moduleData = data['ModuleData']
    console.log(data)
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

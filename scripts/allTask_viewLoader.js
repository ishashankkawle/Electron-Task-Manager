let res = require('../shared/resources')

//require ('handsontable');
//import 'handsontable/dist/handsontable.full.css';

module.exports = class AllTasks_ViewLoader {
  parseSummaryTaskData(
    data,
    activeElement,
    completeElement,
    totalElement,
    slfCompleteElement,
    slfDeleteElement
  ) {
    console.log(data)

    let actCount = document.getElementById('taskboard_new')
    let cpmCount = document.getElementById('taskboard_complete')
    let totCount = document.getElementById('taskboard_total')
    let slfCmplCount = document.getElementById('taskboard_self_complete')
    let slfDelCount = document.getElementById('taskboard_self_complete')

    let activeCount = 0
    let completedCount = 0
    let totalCount = data.length
    let selfCmplCount = 0
    let selfDelCount = 0

    for (let index = 0; index < data.length; index++) {
      const element = data[index]
      if (element['TaskStatus'] == res['WORKFLOW']['STR_WF_NEW'] || element['TaskStatus'] == res['WORKFLOW']['STR_WF_INPROGRESS']) 
      {
        activeCount++
      }
      if (element['TaskStatus'] == res['WORKFLOW']['STR_WF_COMPLETE']) {
        completedCount++
      }
      if (element['TaskStatus'] == res['WORKFLOW']['STR_WF_SELFCOMMIT']) {
        selfCmplCount++
      }
      if (element['TaskStatus'] == res['WORKFLOW']['STR_WF_SELFDELETE']) {
        selfDelCount++
      }
    }

    actCount.innerHTML = activeCount
    cpmCount.innerHTML = completedCount
    totCount.innerHTML = totalCount
    slfCmplCount.innerHTML = selfCmplCount
    slfDelCount.innerHTML = selfDelCount
  }

  loadDataOnTaskTable(moduleData) {
    //@TODO
    //Set DataTable pageLength value dynamically by precalculating using TaskBoard Element size / Window size
    //Get DataTable id as parameter

    let arrDataset = []
    let arrFields = [
      'AssignerName',
      'DateCreated',
      'DateTerminated',
      'Description',
      'Module',
      'OwnerName',
      'Priority',
      'TaskId',
      'TaskStatus',
      'Title',
      'Type',
    ]
    for (let index = 0; index < moduleData.length; index++) {
      let obj = []
      const element = moduleData[index]
      if (
        element['TaskStatus'] == res['WORKFLOW']['STR_WF_NEW'] ||
        element['TaskStatus'] == res['WORKFLOW']['STR_WF_INPROGRESS']
      ) {
        for (let index2 = 0; index2 < arrFields.length; index2++) {
          obj.push(element[arrFields[index2]].toString())
        }
        arrDataset.push(obj)
      }
    }

    res['TASKDATA_TABLE'] = $('#task-board-table').DataTable({
      data: arrDataset,
      columns: [
        { title: 'Asigned By' },
        { title: 'Start Date', visible: false },
        { title: 'End Date' },
        { title: 'Description', visible: false },
        { title: 'Module' },
        { title: 'Owner', visible: false },
        { title: 'Priority', visible: false },
        { title: 'TaskId', visible: false },
        { title: 'Status' },
        { title: 'Title' },
        { title: 'Type' },
        { title: '' },
      ],
      columnDefs: [
        {
          targets: -1,
          data: null,
          defaultContent:
            '<button id=\'all-tsk-opn-tsk-btn\' onclick="openTaskDetails()" class="btn btn-outline-primary btn-sm btn-circle btn-circle-sm"><span class="material-icons md-18">launch</span></button>',
        },
      ],
      pageLength: 6,
      lengthChange: true,
      select: {
        items: 'row',
      },
      dom: '<"toolbar">frtip',
    })
  }
}

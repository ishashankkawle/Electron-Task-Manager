let res = require('../shared/resources')

module.exports = class AllTasks_ViewLoader {
  parseSummaryTaskData(data) {
    if (data == undefined) {
      popupNotification("alert" , "ERROR : No data received")
      return;
    }
    let actCount = document.getElementById('taskboard_new')
    let cpmCount = document.getElementById('taskboard_complete')
    let slfCmplCount = document.getElementById('taskboard_self_commit')
    let slfDelCount = document.getElementById('taskboard_self_delete')

    let activeCount = 0
    let completedCount = 0
    let totalCount = data.length
    let selfCmplCount = 0
    let selfDelCount = 0

    for (let index = 0; index < data.length; index++) {
      const element = data[index]
      if (element['TaskStatus'] == res['WORKFLOW']['STR_WF_NEW'] || element['TaskStatus'] == res['WORKFLOW']['STR_WF_INPROGRESS']) {
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
    slfCmplCount.innerHTML = selfCmplCount
    slfDelCount.innerHTML = selfDelCount
  }

  loadDataOnTaskTable(moduleData) {
    if (moduleData == undefined) {
      return 0;
    }
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
            '<button id=\'all-tsk-opn-tsk-btn\' class="btn btn-outline-primary btn-sm btn-circle btn-circle-sm"><span class="material-icons md-18">launch</span></button>',
        },
      ],
      pageLength: 6,
      lengthChange: true,
      select: {
        items: 'row',
      },
      dom: '<"toolbar">frtip',
    });

    $('#task-board-table tbody').on('click', '#all-tsk-opn-tsk-btn', function () {
      var data = res['TASKDATA_TABLE'].row($(this).parents('tr')).data()
      operationTrigger('tsb_OpenTaskDetails', data[7])
    })
  }
}

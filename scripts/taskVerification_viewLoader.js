let res = require('../shared/resources')
let Util = require('../core/util')

const util = new Util()

module.exports = class TaskVerification_ViewLoader {
  loadSelfCommitsVerificationData(tabledata) {
    let arrSelfCommitData = []
    let arrFields = ['TaskId', 'Title', 'Module']

    for (let outerIndex = 0; outerIndex < tabledata.length; outerIndex++) {
      let element = tabledata[outerIndex]
      let data = []
      data.push('')
      for (let index = 0; index < arrFields.length; index++) {
        data.push(element[arrFields[index]])
      }
      arrSelfCommitData.push(data)
    }

    res['TASKVERIFICATION_SLFCOMMIT_TABLE'] = $('#tskv-selfcommits-table').DataTable({
      data: arrSelfCommitData,
      columns: [
        {},
        { title: 'TaskId', visible: false },
        { title: 'Title' },
        { title: 'Module' },
        { title: 'Action' },
      ],
      pageLength: 5,
      lengthChange: false,
      columnDefs: [
        {
          orderable: false,
          className: 'select-checkbox',
          targets: 0,
        },
        {
          targets: -1,
          data: null,
          defaultContent:
            '<button id=\'tskv-ver-cmpl-btn\' class="btn btn-outline-success btn-sm btn-circle btn-circle-sm"><span class="material-icons">check_circle</span></button><button id=\'tskv-ver-rej-btn\' class="btn btn-outline-danger btn-sm btn-circle btn-circle-sm"><span class="material-icons">restore</span></button>',
        },
      ],
      select: {
        style: 'multi',
        selector: 'td:first-child',
      },
      dom: '<"toolbar">frtip',
    })

    $('div.toolbar', res['TASKVERIFICATION_SLFCOMMIT_TABLE'].table().container()).html(
      '<span onclick="operationTrigger(\'tskv_MarkMultiTaskAsComplete\')" class="material-icons tsb-table-btn" style="border-left: 0px;">check_circle_outline</span><span onclick="operationTrigger(\'tskv_MarkMultiTaskAsRevert\' , \'SelfCommitTable\')" class="material-icons tsb-table-btn">restore</span><span onclick="loadUIElement(\'display\' ,\'views/taskboard\' , \'All Tasks\')" class="material-icons tsb-table-btn">refresh</span>'
    )

    $('#tskv-selfcommits-table tbody').on('click', '#tskv-ver-cmpl-btn', function () {
      console.log('COMPLETE')
      var data = res['TASKVERIFICATION_SLFCOMMIT_TABLE'].row($(this).parents('tr')).data()
      operationTrigger('tskv_MarkTaskAsComplete', data)
    })

    $('#tskv-selfcommits-table tbody').on('click', '#tskv-ver-rej-btn', function () {
      console.log('REJECT')
      var data = res['TASKVERIFICATION_SLFCOMMIT_TABLE'].row($(this).parents('tr')).data()
      operationTrigger('tskv_MarkTaskAsRevert', data)
    })
  }

  loadSelfDeletesVerificationData(tabledata) {
    let arrSelfDeleteData = []
    let arrFields = ['TaskId', 'Title', 'Module']

    for (let outerIndex = 0; outerIndex < tabledata.length; outerIndex++) {
      let element = tabledata[outerIndex]
      let data = []
      data.push('')
      for (let index = 0; index < arrFields.length; index++) {
        data.push(element[arrFields[index]])
      }
      arrSelfDeleteData.push(data)
    }

    console.log(arrSelfDeleteData)
    res['TASKVERIFICATION_SLFDELETE_TABLE'] = $('#tskv-selfdeletes-table').DataTable({
      data: arrSelfDeleteData,
      columns: [
        {},
        { title: 'TaskId', visible: false },
        { title: 'Title' },
        { title: 'Module' },
        { title: 'Action' },
      ],
      pageLength: 5,
      lengthChange: false,
      columnDefs: [
        {
          orderable: false,
          className: 'select-checkbox',
          targets: 0,
        },
        {
          targets: -1,
          data: null,
          defaultContent:
            '<button id=\'tskv-ver-del-btn\' class="btn btn-outline-warning btn-sm btn-circle btn-circle-sm"><span class="material-icons">delete</span></button><button id=\'tskv-ver-rej-btn\' class="btn btn-outline-danger btn-sm btn-circle btn-circle-sm"><span class="material-icons">restore</span></button>',
        },
      ],
      select: {
        style: 'multi',
        selector: 'td:first-child',
      },
      dom: '<"toolbar">frtip',
    })

    $('div.toolbar', res['TASKVERIFICATION_SLFDELETE_TABLE'].table().container()).html(
      '<span onclick="operationTrigger(\'tskv_MarkMultiTaskAsDelete\')" class="material-icons tsb-table-btn" style="border-left: 0px;">delete_outline</span><span onclick="operationTrigger(\'tskv_MarkMultiTaskAsRevert\' , \'SelfDeleteTable\')" class="material-icons tsb-table-btn">restore</span><span onclick="loadUIElement(\'display\' ,\'views/taskboard\' , \'All Tasks\')" class="material-icons tsb-table-btn">refresh</span>'
    )

    $('#tskv-selfdeletes-table tbody').on('click', '#tskv-ver-del-btn', function () {
      console.log('COMPLETE')
      var data = res['TASKVERIFICATION_SLFDELETE_TABLE'].row($(this).parents('tr')).data()
      operationTrigger('tskv_MarkTaskAsDelete', data)
    })

    $('#tskv-selfdeletes-table tbody').on('click', '#tskv-ver-rej-btn', function () {
      console.log('REJECT')
      var data = res['TASKVERIFICATION_SLFDELETE_TABLE'].row($(this).parents('tr')).data()
      operationTrigger('tskv_MarkTaskAsRevert', data)
    })
  }

  loadAssignmentSummaryData(data) {
    let parentElement = document.getElementById('tskv-assign-summary-section')
    let newValue =
      parentElement.children[0].children[0].children[0].children[1].children[0].children[0]
    let inProgressValue =
      parentElement.children[1].children[0].children[0].children[1].children[0].children[0]
    let pendingCommitValue =
      parentElement.children[2].children[0].children[0].children[1].children[0].children[0]
    let pendingDeleteValue =
      parentElement.children[3].children[0].children[0].children[1].children[0].children[0]
    let completeValue =
      parentElement.children[4].children[0].children[0].children[1].children[0].children[0]
    let deleteValue =
      parentElement.children[5].children[0].children[0].children[1].children[0].children[0]

    let newCount = 0
    let inpCount = 0
    let pendCommitCount = 0
    let pendDeleteCount = 0
    let comlCount = 0
    let delCount = 0

    for (let index = 0; index < data.length; index++) {
      if (data[index]['TaskStatus'] == res['WORKFLOW']['STR_WF_COMPLETE']) {
        comlCount = data[index]['count']
      }
      if (data[index]['TaskStatus'] == res['WORKFLOW']['STR_WF_DELETE']) {
        delCount = data[index]['count']
      }
      if (data[index]['TaskStatus'] == res['WORKFLOW']['STR_WF_INPROGRESS']) {
        inpCount = data[index]['count']
      }
      if (data[index]['TaskStatus'] == res['WORKFLOW']['STR_WF_NEW']) {
        newCount = data[index]['count']
      }
      if (data[index]['TaskStatus'] == res['WORKFLOW']['STR_WF_SELFCOMMIT']) {
        pendCommitCount = data[index]['count']
      }
      if (data[index]['TaskStatus'] == res['WORKFLOW']['STR_WF_SELFDELETE']) {
        pendDeleteCount = data[index]['count']
      }
    }

    newValue.innerHTML = newCount
    inProgressValue.innerHTML = inpCount
    pendingCommitValue.innerHTML = pendCommitCount
    pendingDeleteValue.innerHTML = pendDeleteCount
    completeValue.innerHTML = comlCount
    deleteValue.innerHTML = delCount
  }

  loadResourceUtilizationData(data) {
    let tabledata = util.convertArrayForDataTable(data)
    console.log(tabledata)
    $('#tskv-resource-utilization-table').DataTable({
      data: tabledata,
      columns: [{ title: 'Name' }, { title: 'Total' }],
      pageLength: 5,
      lengthChange: false,
      searching: false,
      info: false,
    })
  }

  loaTaskdAssignmentData(data) {
    let tabledata = util.convertArrayForDataTable(data)
    $('#tskv-assign-task-table').DataTable({
      data: tabledata,
      columns: [
        { title: 'Title' },
        { title: 'End Date' },
        { title: 'Status' },
        { title: 'Assigned to' },
      ],
      pageLength: 5,
      lengthChange: false,
    })
  }
}

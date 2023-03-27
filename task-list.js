'use strict';

let taskList = [];

const taskSample = {
  month: '2021-07',
  status: '0',
  title: '【例】A社経営統合プロジェクト',
  summary: '経営統合に伴う業務プロセス統合プロジェクト。\nプロジェクトリーダー(メンバー4人)として担当。\nQDC目標いずれも達成。CS評価で5をいただいた。'
};

const statusValues = [
  '済',
  '進行中',
  '未着手'
];

const inputMonth = document.getElementById('input-month');
const inputStatus = document.getElementById('input-status');
const inputTitle = document.getElementById('input-title');
const inputSummary = document.getElementById('input-summary');
const submitButton = document.getElementById('input-submit');

const escapeHtml = (string) => {
  return string.replace(/[&'`"<>]/g, (match) => {
    return {
      '&': '&amp;',
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;'
    }[match];
  });
};

const localStorageKey = 'taskList';

const setLocalStorage = () => {
  const taskListJSON = JSON.stringify(taskList);
  localStorage.setItem(localStorageKey, taskListJSON);
};

const getLocalStorage = () => {
  const taskListJSON = localStorage.getItem(localStorageKey);
  taskList = JSON.parse(taskListJSON) ?? [];
};

const refreshTable = () => {
  const tbody = document.getElementById('table-body');

  const rowCount = tbody.children.length;
  for (let i = 0; i < rowCount; i++) {
    tbody.deleteRow(-1);
  }

  for (let i = 0; i < taskList.length; i++) {
    const row = tbody.insertRow(i);
    const task = taskList[i];
    for (const prop in task) {
      switch (prop) {
        case 'month':
          row.insertCell(0).appendChild(document.createTextNode(task[prop]));
          break;
        case 'status':
          const status = statusValues[parseInt(task[prop])];
          row.insertCell(1).appendChild(document.createTextNode(status));
          break;
        case 'title':
          const titleCell = row.insertCell(2);
          titleCell.innerHTML = escapeHtml(task[prop]);
          break;
        case 'summary':
          const summaryCell = row.insertCell(3);
          summaryCell.innerHTML = escapeHtml(task[prop]).replace(/\n/g, '<br>');
          break;
      }
    }
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('onclick', `deleteTask(${i})`);
    deleteButton.className = 'button-delete';
    deleteButton.textContent = '削除';
    row.insertCell(4).appendChild(deleteButton);
  }
};

const deleteTask = (index) => {
  taskList.splice(index, 1);

  refreshTable();
  setLocalStorage();
};

const clearInput = () => {
  inputMonth.value = '';
  inputStatus.value = '0';
  inputTitle.value = '';
  inputSummary.value = '';
};

submitButton.onclick = () => {
  const task = {
    month: inputMonth.value,
    status: inputStatus.value,
    title: inputTitle.value,
    summary: inputSummary.value
  };

  const emptyItems = [];
  for (const prop in task) {
    switch (prop) {
      case 'month':
        if (task[prop] === '') {
          emptyItems.push('実施月');
        }
        break;
      case 'title':
        if (task[prop] === '') {
          emptyItems.push('タイトル');
        }
        break;
      case 'summary':
        if (task[prop] === '') {
          emptyItems.push('タスク概要');
        }
        break;
    }
  }
  if (emptyItems.length !== 0) {
    alert(`次の項目を入力してください：${emptyItems.join(', ')}`);
    return;
  }

  taskList.push(task);

  clearInput();

  refreshTable();
  setLocalStorage();
};

(() => {
  getLocalStorage();
  if (taskList.length === 0) {
    taskList.push(taskSample);
  }
  refreshTable();
})();

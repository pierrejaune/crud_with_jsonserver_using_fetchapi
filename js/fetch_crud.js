const postTodo = document.querySelector('.postTodo');
const postBtn = document.querySelector('.postBtn');
const todoList = document.querySelector('.todoList');
const completeList = document.querySelector('.completeList');
const url = 'http://localhost:3000/todos';
const statusList = ['incomplete', 'return', 'complete'];
// Create
const createFetch = () => {
  const data = {
    todo: postTodo.value,
    status: statusList[0],
  };
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        console.log('Create error!');
        throw new Error('error');
      }
      console.log('Create ok!');
      return response.json();
    })
    .then((data) => {
      appendList(todoList, data, ['todo-complete', '完了']);
    })
    .catch((error) => {
      console.log(error);
    });
};

postBtn.addEventListener('click', createFetch, false);

// Read
const readFetch = () => {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        console.log('Read error!');
        throw new Error('error');
      }
      console.log('Read ok!');
      return response.json();
    })
    .then((data) => {
      for (let i in data) {
        const thisData = data[i];
        // console.log(data);
        if (
          thisData.status === statusList[0] ||
          thisData.status === statusList[1]
        ) {
          appendList(todoList, thisData, ['todo-complete', '完了']);
        }
        if (thisData.status === statusList[2]) {
          appendList(completeList, thisData, ['todo-return', '戻す']);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

readFetch();

// Update
const updateFetch = (thisLi, todoStatus, flag = false) => {
  const thisId = thisLi.dataset.id;
  const updateUrl = `${url}/${thisId}`;
  const updateArea = thisLi.querySelector('.updateArea');
  let updateTodo;
  // 'incomplete やること'
  if (todoStatus === statusList[0]) {
    updateTodo = thisLi.querySelector('.updateTodo').value;
  }
  // 'return 戻す'
  if (todoStatus === statusList[1]) {
    updateTodo = thisLi.querySelector('p').textContent;
  }
  // 'complete 完了';
  if (todoStatus === statusList[2]) {
    updateTodo = thisLi.querySelector('p').textContent;
    console.log(thisLi);
  }
  // 'complete 完了エリアで修正';
  if (todoStatus === statusList[2] && flag) {
    updateTodo = thisLi.querySelector('.updateTodo').value;
    console.log(thisLi);
  }

  const data = {
    todo: updateTodo,
    status: todoStatus,
  };

  fetch(updateUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        console.log('Update error!');
        throw new Error('error');
      }
      console.log('Update ok!');
      return response.json();
    })
    .then((data) => {
      thisLi.firstChild.textContent = data.todo;
      thisLi.removeChild(updateArea);
    })
    .catch((error) => {
      console.log(error);
    });
};

document.addEventListener(
  'click',
  (e) => {
    // console.log(e.target.closest('ul').classList.contains('todo-list'));
    // やることエリアで修正
    if (
      e.target.classList.contains('updateBtn') &&
      e.target.closest('ul').classList.contains('todo-list')
    ) {
      const thisLi = e.target.closest('li');
      updateFetch(thisLi, statusList[0]);
    }
    // 完了エリアで修正
    if (
      e.target.classList.contains('updateBtn') &&
      e.target.closest('ul').classList.contains('complete-list')
    ) {
      const thisLi = e.target.closest('li');
      updateFetch(thisLi, statusList[2], true);
    }
  },
  false
);

// 戻すボタン
document.addEventListener(
  'click',
  (e) => {
    if (!e.target.classList.contains('todo-return')) {
      return;
    }
    const thisLi = e.target.closest('li');
    updateFetch(thisLi, statusList[1]);
  },
  false
);

// 完了ボタン
document.addEventListener(
  'click',
  (e) => {
    if (!e.target.classList.contains('todo-complete')) {
      return;
    }
    const thisLi = e.target.closest('li');
    // console.log(thisLi.querySelector('p'));

    updateFetch(thisLi, statusList[2]);
  },
  false
);

document.addEventListener(
  'click',
  (e) => {
    if (!e.target.classList.contains('todo-return')) {
      return;
    }
    const thisLi = e.target.closest('li');
    updateFetch(thisLi, statusList[1]);
  },
  false
);

// Delete
const deleteFetch = (thisLi) => {
  const thisId = thisLi.dataset.id;
  const updateUrl = url + '/' + thisId;

  fetch(updateUrl, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) {
        console.log('Delete error!');
        throw new Error('error');
      }
      console.log('Delete ok!');
    })
    .then(() => {
      thisLi.remove();
    })
    .catch((error) => {
      console.log(error);
    });
};

document.addEventListener(
  'click',
  (e) => {
    if (e.target.className !== 'todo-delete') {
      return;
    }
    const thisLi = e.target.closest('li');
    deleteFetch(thisLi);
  },
  false
);

// Append Button
const appendBtn = (className, text) => {
  const btn = document.createElement('button');
  btn.className = className;
  btn.innerHTML = text;
  return btn;
};

// Append List
const appendList = (area, thisData, array) => {
  const li = document.createElement('li');
  li.dataset.id = thisData.id;
  li.innerHTML = `<p class="todo-text">${thisData.todo}</>`;
  const deleteBtn = appendBtn('todo-delete', '削除');
  li.appendChild(deleteBtn);
  // const flexibleBtn = appendBtn('todo-complete', '完了');
  const flexibleBtn = appendBtn(array[0], array[1]);
  li.appendChild(flexibleBtn);
  const updateBtn = appendBtn('todo-update', '修正');
  li.appendChild(updateBtn);
  area.appendChild(li);
};

// Append Update Area
// const appendUpdateInput = (thisTodo) => {
//   const input = document.createElement('input');
//   input.type = 'text';
//   input.name = 'updateTodo';
//   input.size = '30';
//   input.maxlength = '30px';
//   input.min="0"
//   max="99"
//   oninput="javascript: if(event.isComposing) { event.preventDefault() }
//   input.className = 'update-todo updateTodo';
//   input.value = thisTodo;
//   return input;
// };

// 動的にinput要素を生成 AIのコード
const appendUpdateInput = (thisTodo) => {
  const input = document.createElement('input'); // input要素を作成
  input.type = 'text'; // 文字列入力用のtypeを設定
  input.maxLength = 60; // HTML側での制約（バイト数ではなく文字数に基づく）
  input.min = '0';
  input.type = 'text';
  input.name = 'updateTodo';
  input.className = 'update-todo updateTodo';
  // oninputイベントリスナーを追加
  input.oninput = (event) => {
    const maxBytes = 60; // 全角30文字 = 60バイト
    let value = event.target.value;
    let byteCount = 0;
    let newValue = '';

    // 入力値を1文字ずつバイト数を計算して制限
    for (let char of value) {
      byteCount += char.match(/[^\x00-\x7F]/) ? 2 : 1; // 全角文字は2バイト、それ以外は1バイト
      if (byteCount > maxBytes) break; // バイト数が上限を超えたら終了
      newValue += char;
    }

    // 修正された値をセット
    event.target.value = newValue;
  };
  input.value = thisTodo;
  return input;
};

const appendUpdateBtn = () => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'updateBtn update-btn';
  btn.textContent = '修正';
  return btn;
};

const appendUpdateArea = (thisLi) => {
  const thisTodo = thisLi.firstChild.textContent;
  const appendDiv = document.createElement('div');
  appendDiv.className = 'update-area updateArea';
  appendDiv.appendChild(appendUpdateInput(thisTodo));
  appendDiv.appendChild(appendUpdateBtn());
  thisLi.appendChild(appendDiv);
};

document.addEventListener(
  'click',
  (e) => {
    if (e.target.className !== 'todo-update') {
      return;
    }
    const thisLi = e.target.closest('li');

    if (thisLi.querySelector('.updateArea') === null) {
      appendUpdateArea(thisLi);
    }
  },
  false
);

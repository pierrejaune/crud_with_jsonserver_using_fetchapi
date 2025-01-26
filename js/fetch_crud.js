const postTodo = document.querySelector('.postTodo');
const postBtn = document.querySelector('.postBtn');
const todoList = document.querySelector('.todoList');
const completeList = document.querySelector('.completeList');
const url = 'http://localhost:3000/todos';
const statusList = ['incomplete', 'return', 'complete'];

// Create
const createTodo = async () => {
  const data = {
    todo: postTodo.value,
    status: statusList[0],
  };
  try {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Create ok!');
    appendList(todoList, response.data, ['todo-complete', '完了']);
  } catch (error) {
    console.error('Create error!', error);
  }
};

postBtn.addEventListener('click', createTodo, false);

// Read
const readTodos = async () => {
  try {
    const response = await axios.get(url);
    console.log('Read ok!');
    response.data.forEach((thisData) => {
      if (
        thisData.status === statusList[0] ||
        thisData.status === statusList[1]
      ) {
        appendList(todoList, thisData, ['todo-complete', '完了']);
      }
      if (thisData.status === statusList[2]) {
        appendList(completeList, thisData, ['todo-return', '戻す']);
      }
    });
  } catch (error) {
    console.error('Read error!', error);
  }
};

readTodos();

// Update
const updateTodo = async (thisLi, todoStatus, flag = false) => {
  const thisId = thisLi.dataset.id;
  const updateUrl = `${url}/${thisId}`;
  let updateTodo;

  if (todoStatus === statusList[0]) {
    updateTodo = thisLi.querySelector('.updateTodo').value;
  }
  if (todoStatus === statusList[1] || todoStatus === statusList[2]) {
    updateTodo = thisLi.querySelector('p').textContent;
  }
  if (todoStatus === statusList[2] && flag) {
    updateTodo = thisLi.querySelector('.updateTodo').value;
  }

  const data = {
    todo: updateTodo,
    status: todoStatus,
  };

  try {
    const response = await axios.put(updateUrl, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Update ok!');
    thisLi.firstChild.textContent = response.data.todo;
    const updateArea = thisLi.querySelector('.updateArea');
    if (updateArea) thisLi.removeChild(updateArea);
  } catch (error) {
    console.error('Update error!', error);
  }
};

document.addEventListener(
  'click',
  (e) => {
    if (e.target.classList.contains('updateBtn')) {
      const thisLi = e.target.closest('li');
      const isCompleteList = e.target
        .closest('ul')
        .classList.contains('complete-list');
      updateTodo(
        thisLi,
        isCompleteList ? statusList[2] : statusList[0],
        isCompleteList
      );
    }
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

    updateTodo(thisLi, statusList[2]);
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
    updateTodo(thisLi, statusList[1]);
  },
  false
);

// Delete
const deleteTodo = async (thisLi) => {
  const thisId = thisLi.dataset.id;
  const deleteUrl = `${url}/${thisId}`;

  try {
    await axios.delete(deleteUrl);
    console.log('Delete ok!');
    thisLi.remove();
  } catch (error) {
    console.error('Delete error!', error);
  }
};

document.addEventListener(
  'click',
  (e) => {
    if (e.target.classList.contains('todo-delete')) {
      const thisLi = e.target.closest('li');
      deleteTodo(thisLi);
    }
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
  const flexibleBtn = appendBtn(array[0], array[1]);
  li.appendChild(flexibleBtn);
  const updateBtn = appendBtn('todo-update', '修正');
  li.appendChild(updateBtn);
  area.appendChild(li);
};

// Append Update Area
const appendUpdateInput = (thisTodo) => {
  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = 60;
  input.min = '0';
  input.name = 'updateTodo';
  input.className = 'update-todo updateTodo';
  input.oninput = (event) => {
    const maxBytes = 60;
    let value = event.target.value;
    let byteCount = 0;
    let newValue = '';

    for (let char of value) {
      byteCount += char.match(/[^\x00-\x7F]/) ? 2 : 1;
      if (byteCount > maxBytes) break;
      newValue += char;
    }

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

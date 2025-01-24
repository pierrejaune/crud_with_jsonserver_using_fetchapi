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
const updateFetch = (thisLi, todoStatus) => {
  const thisId = thisLi.dataset.id;
  const updateUrl = `${url}/${thisId}`;
  const updateArea = thisLi.querySelector('.updateArea');
  let updateTodo;
  if (todoStatus === statusList[0]) {
    updateTodo = thisLi.querySelector('.updateTodo').value;
  }
  if (todoStatus === statusList[1]) {
    updateTodo = thisLi.querySelector('p').textContent;
  }
  if (todoStatus === statusList[2]) {
    updateTodo = thisLi.querySelector('p').textContent;
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
    if (!e.target.classList.contains('updateBtn')) {
      return;
    }
    const thisLi = e.target.closest('li');
    updateFetch(thisLi, statusList[0]);
  },
  false
);

// TodoList修正
// document.addEventListener(
//   'click',
//   (e) => {
//     // console.log(e.target.closest('ul').classList.contains('todo-list'));

//     if (
//       !e.target.classList.contains('updateBtn') &&
//       !e.target.closest('ul').classList.contains('todo-list')
//     ) {
//       return;
//     }
//     const thisLi = e.target.closest('li');
//     updateFetch(thisLi, statusList[0]);
//   },
//   false
// );

// やったこと一覧修正
// document.addEventListener(
//   'click',
//   (e) => {
//     // console.log(e.target.closest('ul').classList.contains('complete-list'));

//     if (
//       !e.target.classList.contains('updateBtn') &&
//       e.target.closest('ul').classList.contains('complete-list')
//     ) {
//       return;
//     }
//     const thisLi = e.target.closest('li');
//     updateFetch(thisLi, statusList[2]);
//   },
//   false
// );

// 戻すボタン
document.addEventListener(
  'click',
  (e) => {
    if (!e.target.classList.contains('todo-return')) {
      return;
    }
    const thisLi = e.target.closest('li');
    updateFetch(thisLi, statusList[0]);
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
const appendUpdateInput = (thisTodo) => {
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'updateTodo';
  input.size = '30';
  input.maxlength = '30px';
  input.className = 'update-todo updateTodo';
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

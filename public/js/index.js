// const url = 'https://calm-shelf-89866.herokuapp.com';
const localHost = 'http://localhost:3000';

//Fetch all function
async function fetchTodos() {
  const route = '/alltodos';
  const response = await fetch(`${localHost}${route}`);
  const todos = await response.json();
  return todos;
}

fetchTodos().then((todos) => {
  save(todos);
});
function save(todos) {
  startTodos(todos);
  completed(todos);
  allCategories(todos);
}

const todoInput = document.querySelector('#todo-input');
const categoryInput = document.querySelector('#category-input');
const btn = document.querySelector('#add-button');
const input = document.querySelector('input');
const reset = document.querySelector('#reset');
const form = document.querySelector('#myForm');
todoInput.focus();
reset.addEventListener('click',(e)=>{
  async function deleteTodos() {
    const response = await fetch(
      `${localHost}`,
      {
        method: 'DELETE',
      }
    );
    const todos = await response.json();
    console.log(todos);
    return todos;
  }

  deleteTodos().then((todos) => {
    // save(todos);
  });
  completed()
})

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('submitted');
  const todoText = document.querySelector('#todo-input[type="text"]');
  const categoryText = document.querySelector('#category-input[type="text"]');
  const todo = todoText.value;
  const cat = categoryText.value;
  const data = { todo, cat, complete: 'false' };
  console.log(data);

  if (todo && cat) {
    async function postTodo() {
      const response = await fetch(`${localHost}/addtodo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const todos = await response.json();
      console.log(todos);
      todoInput.value = '';
      categoryInput.value = '';
      todoInput.focus();
      return todos;
    }

    postTodo().then((todos) => {
      save(todos);
    });
  } else {
    alert('must enter a todo and a category');
  }
});


function startTodos(initalTodos) {
  const holder = document.querySelector('.notCompleted');
  holder.textContent = '';
  initalTodos.map((todo) => {
    // selectors
    const notCompleted = document.querySelector('.notCompleted');
    const title1 = document.querySelector('.title1');
    // create elements
    const number = initalTodos.filter((item) => !item.complete);
    if (
      number.length === 0 ||
      number.length === undefined ||
      number.length == null
    ) {
      title1.textContent = 'You have completed all your todos';
    } else {
      title1.textContent =
        number.length > 1
          ? `You have ${number.length} Todo's to complete`
          : `You have ${number.length} Todo to complete`;
    }
    const newLi = document.createElement('li');
    const checkBtn = document.createElement('btn');
    const delBtn = document.createElement('btn');
    const itemCat = document.createElement('ol');
    // add clases
    checkBtn.classList.add('btn');
    delBtn.classList.add('btn');
    // set inner html
    checkBtn.innerHTML = '<i class="fa fa-check"></i>';
    delBtn.innerHTML = '<i class="fa fa-trash"></i>';
    // set text content
    newLi.textContent = todo.todo;
    itemCat.textContent = todo.category;
    // check for completed status
    if (!todo.complete) {
      notCompleted.appendChild(newLi);
      newLi.appendChild(checkBtn);
      newLi.appendChild(delBtn);
    }
    // button event listeners
    delBtn.addEventListener('click', function () {
      const parent = this.parentNode;
      const todotext = parent.textContent;
      const lookup = initalTodos.find((todo) => {
        return todotext === todo.todo;
      });
      const id = lookup._id;
      console.log(id);
      // remove from original array if deleted
      initalTodos.splice(initalTodos.indexOf(lookup), 1);
      parent.remove();
      // save();
      const delRoute = `/todo/:id`;

      async function deleteTodos() {
        const response = await fetch(`${localHost}/todo/${id}`, {
          method: 'DELETE',
        });
        const todos = await response.json();
        console.log(todos);
        return todos;
      }

      deleteTodos().then((todos) => {
        // start(todos);
      });
    });
    // change completed status in original array if marked as complete
    checkBtn.addEventListener('click', function () {
      const parent = this.parentNode;
      const todotext = parent.textContent;
      const lookup = initalTodos.find((todo) => {
        return todotext === todo.todo;
      });
      const index = initalTodos.indexOf(lookup);
      console.log(initalTodos.indexOf(lookup));
      console.log(lookup);
      initalTodos[index]['complete'] = !initalTodos[index]['complete'];
      completed(initalTodos);
      allCategories(initalTodos);
      parent.remove();
      // save();
      const id = lookup._id;
      console.log(id);

      async function toggleComplete() {
        const response = await fetch(`${localHost}/todo/${id}`, {
          method: 'PUT',
        });
        const todos = await response.json();
        console.log(todos);
        return todos;
      }

      toggleComplete().then((todos) => {
        // startTodos(todos);
      });
    });
  });
}

function completed(initalTodos) {
  const holder = document.querySelector('.Completed');
  holder.textContent = null;
  initalTodos.map((todo) => {
    const Completed = document.querySelector('.Completed');

    //make new list item
    const newLi = document.createElement('li');

    const checkBtn = document.createElement('btn');
    const delBtn = document.createElement('btn');
    checkBtn.classList.add('btn');
    delBtn.classList.add('btn');
    checkBtn.innerHTML = '<i class="fa fa-check-circle"></i>';

    delBtn.innerHTML = '<i class="fa fa-trash"></i>';
    newLi.textContent = todo.todo;
    const title2 = document.querySelector('.title2');
    // create elements
    const number = initalTodos.filter((item) => item.complete);
    if (
      number.length === 0 ||
      number.length === undefined ||
      number.length == null
    ) {
      title2.textContent = 'you have not completed any todos';
    } else {
      title2.textContent =
        number.length >= 1
          ? `You have Completed ${number.length} Todo's`
          : `You have Completed ${number.length} Todo`;
    }
    if (todo.complete) {
      Completed.appendChild(newLi);
      newLi.appendChild(checkBtn);
      newLi.appendChild(delBtn);
    }
    checkBtn.addEventListener('click', function () {
      const parent = this.parentNode;
      const todotext = parent.textContent;
      const lookup = initalTodos.find((todo) => {
        return todotext === todo.todo;
      });
      const index = initalTodos.indexOf(lookup);
      console.log(initalTodos.indexOf(lookup));
      console.log(lookup);
      initalTodos[index]['complete'] = !initalTodos[index]['complete'];
      startTodos(initalTodos);
      allCategories(initalTodos);
      parent.remove();
      // save();
      const id = lookup._id;

      async function toggleComplete() {
        const response = await fetch(`${localHost}/todo/${id}`, {
          method: 'PUT',
        });
        const todos = await response.json();
        console.log(todos);
        return todos;
      }

      toggleComplete().then((todos) => {
        // save(todos);
      });
    });
    delBtn.addEventListener('click', function () {
      const parent = this.parentNode;
      const todotext = parent.textContent;
      const lookup = initalTodos.find((todo) => {
        return todotext === todo.todo;
      });
      // remove from original array if deleted
      initalTodos.splice(initalTodos.indexOf(lookup), 1);
      parent.remove();
      // save();
      const id = lookup._id;

      async function deleteTodos() {
        const response = await fetch(`${localHost}/todo/${id}`, {
          method: 'DELETE',
        });
        const todos = await response.json();
        console.log(todos);
        return todos;
      }

      deleteTodos().then((todos) => {
        // start(todos);
      });
    });
  });
}

function allCategories(initalTodos) {
  const allcats = document.querySelector('.Categories');
  allcats.textContent = '';
  const eachCat = initalTodos.map((item) => {
    return item.cat.toLocaleLowerCase();
  });
  const nodupes = Array.from(new Set([...eachCat]));

  for (const value of nodupes) {
    const allcats = document.querySelector('.Categories');

    const newLi = document.createElement('li');
    const delBtn = document.createElement('btn');
    // checkBtn.classList.add('btn');
    delBtn.classList.add('btn');
    delBtn.innerHTML = '<i class="fa fa-trash"></i>';
    newLi.textContent = `${value}`;
    newLi.classList.add('capital');
    allcats.appendChild(newLi);
    initalTodos.filter((todo) => {
      if (todo.cat.toLocaleLowerCase() === value.toLocaleLowerCase()) {
        const items = document.createElement('ol');
        items.classList.add('itemHover');
        const check = document.createElement('btn');
        check.innerHTML = '<i class="fa fa-check"></i>';
        check.classList.add('checkStyle');
        items.textContent = todo.todo;
        items.classList.add('category-list');
        if (todo.complete) {
          items.appendChild(check);
        }
        newLi.appendChild(items);
        todo.complete
          ? items.classList.add('strike')
          : items.classList.add('black');
      }
    });
    const title3 = document.querySelector('.title3');
    if (initalTodos.length) {
      title3.textContent = 'Categories';
    } else {
      title3.textContent = 'No Categories to display';
    }
  }
}

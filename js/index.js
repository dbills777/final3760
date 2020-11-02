const addbutton = document.querySelector('.addButton');
var input = document.querySelector('.input');
const container = document.querySelector('.container');

class item {
  constructor(itemName) {
    this.createDiv(itemName);
  }
  createDiv(itemName) {
    let input = document.createElement('input');
    input.value = itemName;
    input.disabled = true;
    input.classList.add('item_input');
    input.type = 'text';

    let itemBox = document.createElement('div');
    itemBox.classList.add('item');
    let checkbox = document.createElement('input');
    let checkspan = document.createElement('span');
    checkspan.className = 'checkmark';

    checkbox.setAttribute('type', 'checkbox');
    checkbox.className = 'checkbox';

    let editButton = document.createElement('button');
    editButton.className = 'editButton fa fa-pencil-square-o fa-1x';
    let removeButton = document.createElement('button');
    removeButton.className = 'removeButton fa fa-minus';

    container.appendChild(itemBox);

    checkbox.appendChild(checkspan);

    itemBox.appendChild(checkbox);
    itemBox.appendChild(input);
    itemBox.appendChild(editButton);
    itemBox.appendChild(removeButton);

    editButton.addEventListener('click', () => this.edit(input));
    removeButton.addEventListener('click', () => this.remove(itemBox));
    removeButton.addEventListener('click', () => this.remove(itemBox));
    checkbox.addEventListener('click', () => this.strike(input));
  }
  strike(input) {
    input.classList.toggle('strike');
  }
  edit(input) {
    input.disabled = !input.disabled;
  }
  remove(item) {
    container.removeChild(item);
  }
}

function check() {
  if (input.value != '') {
    new item(input.value);
    input.value = '';
  }
}
addbutton.addEventListener('click', check);
window.addEventListener('keydown', (e) => {
  //e.which returns the keycode value of which key was pressed 13 is the enter key
  if (e.which == 13) {
    check();
  }
});

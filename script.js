function $(selector) {
    return document.querySelector(selector);
}

// массив для хранения данных  при первой загрузке пустой, далее - из localStorage
const data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : [];


// дабавляем событие открытия инпутов

function openInput() {
    $('#openInput').addEventListener('click', () => {
        $('.app-body').classList.remove('app-body-hide');
    });
}

openInput();


// дабавляем событие закрытия инпутов

function closeInput() {
    $('#closeInput').addEventListener('click', () => {
        $('.app-body').classList.add('app-body-hide');
    });
}

closeInput();

// добавляем событие открытия/закрытия поля поиска

function toggleSearch() {
    $('#toggleSearch').addEventListener('click', () => {
        $('#searchField').classList.toggle('search-form-hide');
    })
}

toggleSearch();

// событие для добавления проекта

function addProject() {
    $('#projectForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const projectObj = {
            projectName: '',
            hours: 0,
            tasks: []
        };

        const isValid = $('#projectForm').checkValidity();

        if (!isValid) {
            $('#projectForm').classList.add('check-valid');
        } else {
            $('#projectForm').classList.remove('check-valid');

            const formData = new FormData($('#projectForm'))

            projectObj.projectName = formData.get('project_name');
            data.push(projectObj);
            e.currentTarget.reset();
            buildList(data);

            localStorage.setItem('data', JSON.stringify(data));
        }


    });
}

addProject();

// функция отрисовки массива
const listEl = document.createElement('ul');

function buildList(data) {
    listEl.innerHTML = '';
    data.forEach((element, index) => {
        const listItemEl = document.createElement('ul');
        listItemEl.classList.add('ul-project');

        const listItemHeaderEl = document.createElement('div');
        listItemHeaderEl.classList.add('ul-header');

        const spanProjItemEl = document.createElement('span');
        spanProjItemEl.textContent = element.projectName;
        spanProjItemEl.classList.value = 'mr-3 ml-3';

        const spanHoursItemEl = document.createElement('span');
        spanHoursItemEl.textContent = element.hours;
        spanHoursItemEl.classList.value = 'mr-3 ml-auto';

        const buttonItemEl = document.createElement('button');
        buttonItemEl.textContent = 'X';
        buttonItemEl.classList.value = 'btn btn-danger btn-sm mr-3';

        listItemHeaderEl.append(spanProjItemEl, spanHoursItemEl, buttonItemEl);
        listItemEl.append(listItemHeaderEl);

        buildTaskList(listItemEl, element.tasks, index);

        listEl.append(listItemEl);
        buttonItemEl.addEventListener('click', () => {
            data.splice(index, 1);
            buildList(data);
            localStorage.setItem('data', JSON.stringify(data));
        });
    });
    $('.app-body').append(listEl);
}

//вызов функции для отрисовки данны из localStorage
buildList(data);

// функция добавление задачи и времени в массив

function addTaskAndTime(formData) {
    data.forEach((element) => {
        if (element.projectName === formData.get('project_name')) {
            element.tasks.push({
                taskName: formData.get('task_name'),
                time: formData.get('time')
            });
            element.hours += +formData.get('time');
        }
    });

    localStorage.setItem('data', JSON.stringify(data));
}

// событие для 2-ого инпута

function addTaskHandler() {
    $('#taskForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const isValid = $('#taskForm').checkValidity();

        if (!isValid) {
            $('#taskForm').classList.add('check-valid');
        } else {
            $('#taskForm').classList.remove('check-valid');

            const formData = new FormData($('#taskForm'));

            addTaskAndTime(formData);
            e.currentTarget.reset();
            buildList(data);
        }
    });
}

addTaskHandler();

// функция отрисовски тасков

function buildTaskList(parent, arr, dataIndex) {
    arr.forEach((element, index) => {
        if (element) {
            const taskListIemEl = document.createElement('li');

            const taskNameItem = document.createElement('span');
            taskNameItem.textContent = element.taskName;
            taskNameItem.classList.value = 'mr-3 ml-3'

            const taskTimeItem = document.createElement('span');
            taskTimeItem.textContent = element.time;
            taskTimeItem.classList.value = 'mr-3 ml-auto';

            const deleteTaskButtonEl = document.createElement('button');
            deleteTaskButtonEl.textContent = 'X';
            deleteTaskButtonEl.classList.value = 'btn btn-danger btn-sm mr-3';

            taskListIemEl.append(taskNameItem, taskTimeItem, deleteTaskButtonEl);

            deleteTaskButtonEl.addEventListener('click', () => {
                arr.splice(index, 1);
                data[dataIndex].hours -= element.time;
                buildList(data);
                localStorage.setItem('data', JSON.stringify(data));
            });
            parent.append(taskListIemEl);

        }
    });
}

// функция фильтра массива

function filterData(text) {
    const filteredData = data.filter((element) => {
        if (element.projectName.includes(text)) {
            return true;
        } else {
            return false;
        }
    });

    buildList(filteredData);
}

// функция события отрисовки отфильтрованного массива

function addSearchHandler() {
    $('#search').addEventListener('input', (e) => {
        filterData(e.currentTarget.value);
    });
}

addSearchHandler();

// функция сортировки массива

function sortData(value) {
    if (value === 'hours') {
        data.sort((prev, next) => {
            return (prev[value] > next[value]) ? -1 : 1;
        });
    } else {
        data.sort((prev, next) => {
            return (prev.tasks.length > next.tasks.length) ? -1 : 1;
        });
    }
    buildList(data);
    localStorage.setItem('data', JSON.stringify(data));
}

// функция события отрисовки отсортированного массива

function addSortHandler() {
    $('#sort').addEventListener('change', (e) => {
        sortData(e.currentTarget.value);
    });
}

addSortHandler();










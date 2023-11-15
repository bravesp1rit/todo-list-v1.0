void function () {
    'use strict';

    const FORM_ID = 'todoForm';
    const ROW_ID = 'todoItems';
    const DATA_KEY = 'TODO_ITEMS';
    const form = document.querySelector(`#${FORM_ID}`);
    let itemsContainer = document.querySelector(`#${ROW_ID}`);

    const getData = () => {
        return JSON.parse(localStorage.getItem(DATA_KEY)) || [];
    }
    const setData = (data) => {
        const savedData = getData();
        const todoItemsData = { ...data };
        savedData.push(todoItemsData);
        localStorage.setItem(DATA_KEY, JSON.stringify(savedData));
        return getData().at(-1);
    }
    const deleteData = (num) => {
        const data = getData();
        data.splice(num, 1);
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
    }
    const createTemplate = ({ title, description }) => {
        const itemWrap = document.createElement('div');
        itemWrap.className = 'col-4';

        const taskWrapper = document.createElement('div');
        taskWrapper.className = 'taskWrapper';

        const taskHeading = document.createElement('div');
        taskHeading.className = 'taskHeading';
        taskHeading.innerHTML = title;

        const taskDescription = document.createElement('div');
        taskDescription.className = 'taskDescription';
        taskDescription.innerHTML = description;

        const taskDelete = document.createElement('button');
        taskDelete.className = 'taskDelete';
        taskDelete.innerHTML = 'X';
        taskDelete.addEventListener('click', ({target}) => {
            const data = getData();
            target.parentElement.parentElement.remove();
            const title = taskHeading.innerHTML;
            const desc = taskDescription.innerHTML;
            const IndexOfDeletedElement = data.findIndex(item => item.title === title && item.description === desc)
            deleteData(IndexOfDeletedElement);
        })

        itemWrap.append(taskWrapper);
        taskWrapper.append(taskDelete);
        taskWrapper.append(taskHeading);
        taskWrapper.append(taskDescription);
        return itemWrap;
    }

    form.addEventListener('submit', evt => {
        evt.preventDefault();
        evt.stopPropagation();

        const { target } = evt;
        const data = Array.from(target.querySelectorAll('input, textarea')).reduce((acc, { name, value }) => {
            acc[name] = value;
            return acc;
        }, {});

        const savedData = setData(data);
        itemsContainer.prepend(createTemplate(savedData));
        form.reset();    
    })


    document.addEventListener('DOMContentLoaded', () => {
        const savedData = getData();
        if (!savedData.length) return;

        const newContainer = itemsContainer.cloneNode(false);
        savedData.forEach(item => {
            newContainer.prepend(createTemplate(item));
        })
        itemsContainer.replaceWith(newContainer);
    })

}()
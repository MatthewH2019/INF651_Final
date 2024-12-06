functiontoggleComments()
{
    // Temporarily undefined
}

function createElemWithText(element = 'p', textContent = '', className)
{
    const newElement = document.createElement(element);
    newElement.textContent = textContent;
    
    if (className) newElement.className = className;
    
    return newElement;
}

function createSelectOptions(users)
{
    if (!users) 
        return undefined;

    const options = [];
    for (const user of users)
    {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        options.push(option);
    }

    return options;
}

function toggleCommentSection(postId)
{
    if (!postId) 
        return undefined;
    
    const section = document.querySelector(`section[data-post-id="${postId}"]`);

    if (section) 
        section.classList.toggle('hide');
  
    return section;
}

function toggleCommentButton(postId)
{
    if (!postId) 
        return undefined;

    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    
    if (button) button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';

    return button;
}

function deleteChildElements(parentElement)
{
    if (!parentElement?.tagName) 
        return undefined;

    let child = parentElement.lastElementChild;

    while (child)
    {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }

    return parentElement;
}

function addButtonListeners()
{
    const buttons = document.querySelectorAll('main button');

    if (buttons)
    {
        buttons.forEach(button => 
        {
            const postId = button.dataset.postId;
            if (postId) {
                button.addEventListener('click', (event) => {
                    toggleComments(event, postId);
                });
            }
        });
    }

    return buttons;
}

function removeButtonListeners()
{
    const buttons = document.querySelectorAll('main button');

    if (buttons)
    {
        buttons.forEach(button => {
            const postId = button.dataset.id;
            if (postId) {
                button.removeEventListener('click', toggleComments);
            }
        });
    }

    return buttons;
}

function createComments(comments)
{
    if (!comments)
        return undefined;

    const fragment = document.createDocumentFragment();

    for (const comment of comments)
    {
        const article = document.createElement('article');
        const h3 = createElemWithText('h3', comment.name);
        const bodyParagraph = createElemWithText('p', comment.body);
        const emailParagraph = createElemWithText('p', `From: ${comment.email}`);

        article.appendChild(h3);
        article.appendChild(bodyParagraph);
        article.appendChild(emailParagraph);

        fragment.appendChild(article);
    }

    return fragment;
}

function populateSelectMenu(users)
{
    if (!users)
        return undefined;

    const selectMenu = document.getElementById('selectMenu');
    const options = createSelectOptions(users);

    if (selectMenu && options) {
        options.forEach(option => {
            selectMenu.appendChild(option);
        });
    }

    return selectMenu;
}

async function getUsers()
{
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
}
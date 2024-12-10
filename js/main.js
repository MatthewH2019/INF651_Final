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

async function getUserPosts(userId)
{
    if (!userId)
        return undefined;

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return null;
    }
}

async function getUser(userId)
{
    if (!userId)
        return undefined;

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

async function getPostComments(postId) 
{
    if (!postId)
        return undefined;

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching post comments:', error);
        return null;
    }
}

async function displayComments(postId)
{
    if (!postId)
        return undefined;

    const section = document.createElement('section');
    section.dataset.postId = postId;
    section.classList.add('comments', 'hide');

    const comments = await getPostComments(postId);
    const fragment = createComments(comments);

    section.appendChild(fragment);

    return section;
}

async function createPosts(postsData)
{
    if (!postsData)
        return undefined;

    const fragment = document.createDocumentFragment();

    for (const post of postsData)
    {
        const article = document.createElement('article');
        const h2 = createElemWithText('h2', post.title);
        const body = createElemWithText('p', post.body);
        const postId = createElemWithText('p', `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const authorInfo = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const companyCatchPhrase = createElemWithText('p', author.company.catchPhrase);
        const showCommentsBtn = document.createElement('button');
        showCommentsBtn.textContent = 'Show Comments';
        showCommentsBtn.dataset.postId = post.id;

        article.appendChild(h2);
        article.appendChild(body);
        article.appendChild(postId);
        article.appendChild(authorInfo);
        article.appendChild(companyCatchPhrase);
        article.appendChild(showCommentsBtn);

        const section = await displayComments(post.id);
        article.appendChild(section);

        fragment.appendChild(article);
    }

    return fragment;
}

async function displayPosts(posts)
{
    if (!posts)
        return createElemWithText('p', 'Select an Employee to display their posts.', 'default-text');

    const mainElement = document.querySelector('main');
    const element = posts ? await createPosts(posts) : createElemWithText('p');
    mainElement.appendChild(element);
    return element;
}

function toggleComments(event, postId)
{
    if (!event && !postId)
        return undefined;

    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);

    return [section, button];
}

async function refreshPosts(postsData)
{
    if (!postsData)
        return undefined;

    const buttonRemovers = removeButtonListeners();
    const main = deleteChildElements(document.querySelector('main'));
    const fragment = await displayPosts(postsData);
    const buttonAdders = addButtonListeners();

    return [buttonRemovers, main, fragment, buttonAdders];
}

async function selectMenuChangeEventHandler(event)
{
    if(!event)
        return undefined; 

    const selection = document.querySelector("#selectMenu");
    selection.disabled = true;
    const userId =
            event?.target?.value === "Employees" || !event?.target?.value
                ? 1
                : event?.target?.value;

    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    selection.disabled = false;
    return [userId, posts, refreshPostsArray];
}

async function initPage()
{
    const users = await getUsers();
    const select = await populateSelectMenu(users);

    return [users, select];
}

function initApp()
{
    initPage().then(([users, select]) => {
        const selectMenu = document.getElementById('selectMenu');
        selectMenu.addEventListener('change', (event) => selectMenuChangeEventHandler(event));
    });
}
document.addEventListener("DOMContentLoaded", initApp);
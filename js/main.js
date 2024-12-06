function createElemWithText(element = 'p', textContent = '', className) {
    const newElement = document.createElement(element);
    newElement.textContent = textContent;
    
    if (className) {
        newElement.className = className;
    }
    
    return newElement;
}
export const createElement = (tag, options = {}) => {
    const el = document.createElement(tag);
    if (options.className)
        el.className = options.className;
    if (options.textContent !== undefined)
        el.textContent = options.textContent;
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            el.setAttribute(key, value);
        });
    }
    if (options.children) {
        el.append(...options.children);
    }
    return el;
};

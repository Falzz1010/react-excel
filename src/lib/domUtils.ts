// Safe DOM manipulation utilities to prevent removeChild errors

// Global error handler for DOM operations
const originalRemoveChild = Node.prototype.removeChild;
const originalAppendChild = Node.prototype.appendChild;
const originalInsertBefore = Node.prototype.insertBefore;

// Safe removeChild wrapper
Node.prototype.removeChild = function(child: Node): Node {
  try {
    // Check if child is actually a child of this node
    if (child && child.parentNode === this) {
      return originalRemoveChild.call(this, child);
    } else {
      // Child is not a child of this node, just return the child
      console.warn('Attempted to removeChild a node that is not a child of the parent');
      return child;
    }
  } catch (error) {
    console.warn('removeChild error caught and handled:', error);
    return child;
  }
};

// Safe appendChild wrapper
Node.prototype.appendChild = function(child: Node): Node {
  try {
    return originalAppendChild.call(this, child);
  } catch (error) {
    console.warn('appendChild error caught and handled:', error);
    return child;
  }
};

// Safe insertBefore wrapper
Node.prototype.insertBefore = function(newNode: Node, referenceNode: Node | null): Node {
  try {
    return originalInsertBefore.call(this, newNode, referenceNode);
  } catch (error) {
    console.warn('insertBefore error caught and handled:', error);
    return newNode;
  }
};

// Global error handler for unhandled errors
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('removeChild')) {
    console.warn('removeChild error caught by global handler:', event.error);
    event.preventDefault();
    return false;
  }
});

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('removeChild')) {
    console.warn('removeChild promise rejection caught by global handler:', event.reason);
    event.preventDefault();
  }
});

// Safe DOM cleanup utility
export const safeRemoveChild = (parent: Node, child: Node): boolean => {
  try {
    if (child && child.parentNode === parent) {
      parent.removeChild(child);
      return true;
    }
    return false;
  } catch (error) {
    console.warn('safeRemoveChild error:', error);
    return false;
  }
};

// Safe DOM append utility
export const safeAppendChild = (parent: Node, child: Node): boolean => {
  try {
    parent.appendChild(child);
    return true;
  } catch (error) {
    console.warn('safeAppendChild error:', error);
    return false;
  }
};

// Cleanup all elements with specific class
export const safeCleanupByClass = (className: string): void => {
  try {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => {
      if (element.parentNode) {
        safeRemoveChild(element.parentNode, element);
      }
    });
  } catch (error) {
    console.warn('safeCleanupByClass error:', error);
  }
};

// Initialize DOM safety
export const initDOMSafety = () => {
  console.log('DOM safety utilities initialized');
};

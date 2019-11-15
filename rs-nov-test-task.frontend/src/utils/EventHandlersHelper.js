let _eventHandlers = {}

// Обёртка для стандартных методов работы с событиями
// Хранятся элемент, к которому привязано событие, обработчик и тип события
// Требуется для удобного удаления обработчиков в случае необходимости
export  {addListener, removeAllListeners}

function addListener(node, event, handler, capture) {
    if(!(node in _eventHandlers)) {
        _eventHandlers[node] = {}
    }
    if(!(event in _eventHandlers[node])) {
        _eventHandlers[node][event] = []
    }
    _eventHandlers[node][event].push([handler, capture])
    node.addEventListener(event, handler, capture)
}


function removeAllListeners(node, event) {
    if(node in _eventHandlers) {
        let handlers = _eventHandlers[node]
        if(event in handlers) {
            let eventHandlers = handlers[event]
            for(let i = eventHandlers.length; i--;) {
                let handler = eventHandlers[i];
                node.removeEventListener(event, handler[0], handler[1])
            }
        }
    }
}
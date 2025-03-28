import React, { useState } from 'react';
import './ExampleComponent.scss';

const ExampleComponent = () => {
  const [components, setComponents] = useState([]);

  const addComponent = (id) => {
    setComponents((prevComponents) => [
      ...prevComponents,
      { id: Date.now(), x: 100, y: 100, parentId: id },
    ]);
  };

  const handleDrag = (e, id) => {
    const { clientX, clientY } = e;
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id
          ? { ...component, x: clientX, y: clientY }
          : component
      )
    );
  };

  return (
    <div className="canvas">
      {components.map((component) => (
        <div
          key={component.id}
          className="draggable-component"
          style={{ left: component.x, top: component.y }}
          onMouseDown={(e) => {
            e.preventDefault();
            const onMouseMove = (moveEvent) => handleDrag(moveEvent, component.id);
            const onMouseUp = () => {
              window.removeEventListener('mousemove', onMouseMove);
              window.removeEventListener('mouseup', onMouseUp);
            };
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
          }}
        >
          Component {component.id}
          <button
            className="add-button"
            onClick={(e) => {
              e.stopPropagation();
              addComponent(component.id);
            }}
          >
            +
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExampleComponent;
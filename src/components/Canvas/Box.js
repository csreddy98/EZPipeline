import React, { useState } from 'react';

const Box = ({ id, x, y, onMouseDown, onAddBox, showAddButton, isSelected, label, onLabelChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(label);

    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
        setEditValue(label);
    };

    const handleInputChange = (e) => {
        setEditValue(e.target.value);
    };

    const handleInputBlur = () => {
        setIsEditing(false);
        onLabelChange(id, editValue);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            onLabelChange(id, editValue);
        }
    };

    return (
        <div>
            {isSelected && (
                <button
                    style={{
                        position: 'absolute',
                        top: `${y - 30}px`,
                        left: `${x + 50}px`,
                        padding: '3px 8px',
                        backgroundColor: '#fff',
                        border: '1px solid #000',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontStyle: 'italic',
                        fontWeight: 'bold'
                    }}
                    onClick={handleEditClick}
                >
                    i
                </button>
            )}
            <div
                style={{ 
                    position: 'absolute', 
                    top: `${y}px`, 
                    left: `${x}px`, 
                    padding: '10px 20px', 
                    backgroundColor: isSelected ? '#b3e0ff' : '#f0f0f0', 
                    border: isSelected ? '2px solid #0088cc' : '1px solid #000', 
                    borderRadius: '5px', 
                    textAlign: 'center', 
                    cursor: 'grab',
                    userSelect: 'none',
                    boxShadow: isSelected ? '0 0 5px rgba(0, 136, 204, 0.5)' : 'none',
                    minWidth: '130px',
                }}
                onMouseDown={onMouseDown}
            >
                {isEditing ? (
                    <input
                        type="text"
                        value={editValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            textAlign: 'center'
                        }}
                    />
                ) : (
                    label
                )}
            </div>
            {showAddButton && (
                <button 
                    style={{ 
                        position: 'absolute', 
                        top: `${y + 15}px`, 
                        left: `${x + 200}px`, 
                        width: '25px',
                        height: '25px',
                        padding: '5px', 
                        backgroundColor: '#fff', 
                        border: '1px solid #000', 
                        borderRadius: '50%', 
                        cursor: 'pointer' 
                    }}
                    onClick={onAddBox}
                >
                    +
                </button>
            )}
        </div>
    );
};

export default Box;
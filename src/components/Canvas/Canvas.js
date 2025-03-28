import React, { useState, useEffect } from 'react';
import Box from './Box';
import BeginBox from './BeginBox';
import Editor from '@monaco-editor/react';

const Canvas = () => {
    const [boxes, setBoxes] = useState([]);
    const [beginBoxConfig, setBeginBoxConfig] = useState({
        os: 'ubuntu-latest',
        trigger: 'push',
    });
    const [isDragging, setIsDragging] = useState(false);
    const [draggingBoxId, setDraggingBoxId] = useState(null);
    const [selectedBoxId, setSelectedBoxId] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [connections, setConnections] = useState([]);
    const [isCanvasExpanded, setIsCanvasExpanded] = useState(true);
    const [isEditorExpanded, setIsEditorExpanded] = useState(true);
    const [githubActionsCode, setGitHubActionsCode] = useState('');


    // Assume a standard box width and height for connection calculations
    const BOX_WIDTH = 130; // Width of the box content + padding
    const BOX_HEIGHT = 40; // Height of the box content + padding

    const handleMouseDown = (e, id) => {
        const box = boxes.find(box => box.id === id);
        if (box) {
            // Set selected box
            setSelectedBoxId(id);
            
            // Handle dragging
            setOffset({ 
                x: e.clientX - box.x, 
                y: e.clientY - box.y 
            });
            setIsDragging(true);
            setDraggingBoxId(id);
        }
    };

    // Handle click on the canvas (away from boxes)
    const handleCanvasClick = (e) => {
        // Only deselect if clicking directly on the canvas
        if (e.target === e.currentTarget) {
            setSelectedBoxId(null);
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && draggingBoxId !== null) {
            setBoxes(prevBoxes =>
                prevBoxes.map(box =>
                    box.id === draggingBoxId
                        ? { ...box, x: e.clientX - offset.x, y: e.clientY - offset.y }
                        : box
                )
            );
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDraggingBoxId(null);
    };

    const updateGitHubActionsCode = () => {
        const steps = boxes.map(box => `- name: ${box.label}
    run: echo "Running ${box.label}"`).join('\n');

        let code = `name: CI Pipeline`;
        if (beginBoxConfig.trigger === 'pull_request' || beginBoxConfig.trigger === 'push') {
            code += `
on:
    ${beginBoxConfig.trigger}:
        branches:
            - main
            `;
        } else {
            code += `
on:
    push:
        branches:
            - main
    pull_request:
        branches:
            - main
            `;
        }
        code += `
jobs:
    build:
        runs-on: ${beginBoxConfig.os}

steps:
${steps}`;

        setGitHubActionsCode(code);
    };

    const handleBeginBoxConfigChange = (config) => {
        setBeginBoxConfig(config);
        updateGitHubActionsCode();
    };

    const handleAddBox = (sourceId) => {
        const newBoxId = Date.now();
        setBoxes(prevBoxes => {
            const updatedBoxes = [
                ...prevBoxes,
                { id: newBoxId, x: 300, y: 100, label: 'New Step' }
            ];
            updateGitHubActionsCode();
            return updatedBoxes;
        });
        setConnections(prevConnections => [
            ...prevConnections,
            { source: sourceId, target: newBoxId }
        ]);
        setSelectedBoxId(newBoxId);
    };

    const handleLabelChange = (id, newLabel) => {
        setBoxes(prevBoxes => {
            const updatedBoxes = prevBoxes.map(box =>
                box.id === id
                    ? { ...box, label: newLabel }
                    : box
            );
            updateGitHubActionsCode();
            return updatedBoxes;
        });
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, draggingBoxId, offset]);

    useEffect(() => {
        updateGitHubActionsCode();
    }, [boxes, beginBoxConfig]);

    const hasOutgoingConnection = (boxId) => {
        return connections.some(conn => conn.source === boxId);
    };

    const getConnectionPoints = (sourceBox, targetBox) => {
        const sourceX = sourceBox.x + BOX_WIDTH;
        const sourceY = sourceBox.y + BOX_HEIGHT / 2;
        
        const targetX = targetBox.x;
        const targetY = targetBox.y + BOX_HEIGHT / 2;
        
        return { sourceX, sourceY, targetX, targetY };
    };

    const toggleCanvasSection = () => {
        setIsCanvasExpanded(!isCanvasExpanded);
    };

    const toggleEditorSection = () => {
        setIsEditorExpanded(!isEditorExpanded);
    };

    return (
        <div>
            <div>
                <button onClick={toggleCanvasSection} style={{ marginBottom: '10px' }}>
                    {isCanvasExpanded ? 'Hide Canvas' : 'Show Canvas'}
                </button>
            </div>
            {isCanvasExpanded && (
                <div 
                    style={{ width: '100vw', height: '70vh', border: '1px solid #000', position: 'relative' }}
                    onClick={handleCanvasClick}
                >
                    <BeginBox
                        id="begin"
                        x={50}
                        y={20}
                        onMouseDown={() => {}}
                        onConfigChange={handleBeginBoxConfigChange}
                        onAddBox={() => handleAddBox('begin')}
                        showAddButton={boxes.length === 0}
                    />
                    {boxes.map((box) => (
                        <Box 
                            key={box.id} 
                            id={box.id}
                            x={box.x} 
                            y={box.y} 
                            label={box.label}
                            onMouseDown={(e) => handleMouseDown(e, box.id)} 
                            onAddBox={() => handleAddBox(box.id)}
                            onLabelChange={handleLabelChange}
                            showAddButton={!hasOutgoingConnection(box.id)}
                            isSelected={selectedBoxId === box.id}
                        />
                    ))}
                    <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                        {connections.map((conn, index) => {
                            const sourceBox = conn.source === 'begin' ? { x: 125, y: 50 } : boxes.find(box => box.id === conn.source);
                            const targetBox = boxes.find(box => box.id === conn.target);
                            
                            if (sourceBox && targetBox) {
                                const { sourceX, sourceY, targetX, targetY } = getConnectionPoints(sourceBox, targetBox);
                                
                                return (
                                    <line
                                        key={index}
                                        x1={sourceX + 40} // Adjust for the width of the box
                                        y1={sourceY}
                                        x2={targetX}
                                        y2={targetY}
                                        stroke="black"
                                        strokeWidth="2"
                                    />
                                );
                            }
                            return null;
                        })}
                    </svg>
                </div>
            )}
            <div>
                <button onClick={toggleEditorSection} style={{ marginTop: '10px', marginBottom: '10px' }}>
                    {isEditorExpanded ? 'Hide Editor' : 'Show Editor'}
                </button>
            </div>
            {isEditorExpanded && (
                <div style={{ width: '100%', height: '30vh', marginTop: '10px' }}>
                    <Editor
                        height="100%"
                        defaultLanguage="yaml"
                        value={githubActionsCode}
                        options={{ readOnly: true, minimap: { enabled: false } }}
                    />
                </div>
            )}
        </div>
    );
};

export default Canvas;
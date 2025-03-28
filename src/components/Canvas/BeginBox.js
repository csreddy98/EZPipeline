import React, { useState } from 'react';

const BeginBox = ({ x, y, onMouseDown, onConfigChange, onAddBox, showAddButton }) => {
    const [config, setConfig] = useState({
        os: 'ubuntu-latest',
        trigger: 'push',
    });

    const triggerOptions = [
        { value: 'push', label: 'Push' },
        { value: 'pull_request', label: 'Pull Request' },
        { value: 'push/pr', label: 'Push or Pull Request' } // Combined option for flexibility
    ];

    const operatingSystems = [
        'ubuntu-latest',
        'ubuntu-22.04', // Specific version of Ubuntu
        'kali-latest', // Kali Linux for security testing
        'alpine-latest', // Lightweight Linux distribution
        'windows-latest', // Windows Server for .NET or other Windows-specific tasks
        'windows-2022', // Specific version of Windows Server
        'macos-latest', // macOS for iOS or macOS-specific tasks
        'macos-13', // Specific version of macOS
        'macos-12', // Another specific version of macOS
    ];

    const handleConfigChange = (key, value) => {
        const updatedConfig = { ...config, [key]: value };
        setConfig(updatedConfig);
        onConfigChange(updatedConfig);
    };

    return (
        <div
            style={{ 
                position: 'absolute', 
                top: `${y}px`, 
                left: `${x}px`, 
                padding: '10px 20px', 
                backgroundColor: '#f0f0f0', 
                border: '2px solid #0088cc', 
                borderRadius: '5px', 
                textAlign: 'center', 
                cursor: 'grab',
                userSelect: 'none',
                boxShadow: '0 0 5px rgba(0, 136, 204, 0.5)',
                minWidth: '150px',
            }}
            onMouseDown={onMouseDown}
        >
            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Pipeline Config</div>
            <div style={{ marginBottom: '5px' }}>
                <label>OS: </label>
                <select
                    value={config.os}
                    onChange={(e) => handleConfigChange('os', e.target.value)}
                >
                    {operatingSystems.map((os) => (
                        <option key={os} value={os}>
                            {os}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label>Trigger: </label>
                <select
                    value={config.trigger}
                    onChange={(e) => handleConfigChange('trigger', e.target.value)}
                >
                    {triggerOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {
                showAddButton &&
                    <button 
                        style={{ 
                            position: 'absolute', 
                            top: `${y}px`, 
                            left: `${x + 200}px`, 
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
            }
        </div>
    );
};

export default BeginBox;
import React from 'react';
import {
    Terminal, Box, Binary, Keyboard, GitGraph, Repeat, List, FunctionSquare,
    Book, Package, FileText, LayoutTemplate, AlertTriangle, BoxSelect, Rocket, Code,
    Award, Crown, Shield, Zap, Target, Flag, Map, Compass, Scroll
} from 'lucide-react';

const ICONS = [
    <Terminal size={24} />, <Box size={24} />, <Binary size={24} />, <Keyboard size={24} />, 
    <GitGraph size={24} />, <Repeat size={24} />, <List size={24} />, <FunctionSquare size={24} />,
    <Book size={24} />, <Package size={24} />, <FileText size={24} />, <LayoutTemplate size={24} />, 
    <AlertTriangle size={24} />, <BoxSelect size={24} />, <Rocket size={24} />, <Code size={24} />,
    <Shield size={24} />, <Zap size={24} />, <Target size={24} />, <Flag size={24} />, 
    <Map size={24} />, <Compass size={24} />, <Scroll size={24} />, <Crown size={24} />
];

const CERTIFICATE_ICON = <Award size={32} className="text-yellow-400" />;

// Square Spiral Generation for 5x5 Grid (25 Levels)
export const generateLevels = (count = 25) => {
    const levels = [];
    
    // Define the grid positions (0-4 x 0-4)
    // We want to map linear index 0..24 to these grid coordinates in a spiral.
    // Spiral Path for 5x5: Top-Left -> Right -> Down -> Left -> Up -> Right... -> Center
    // Coordinates (col, row)
    // Define the grid positions (0-4 x 0-4)
    // We want to map linear index 0..24 to these grid coordinates in a spiral.
    // Spiral Path for 5x5: Bottom-Right -> Left -> Up -> Right -> Down ... -> Center
    // This places Level 1 near the Play Button (Bottom Right)
    // Coordinates (col, row)
    const spiralCoords = [
        // Ring 0 (Outer) - 16 nodes
        [4,4], [3,4], [2,4], [1,4], [0,4], // Bottom row <-
        [0,3], [0,2], [0,1], [0,0],        // Left col ^
        [1,0], [2,0], [3,0], [4,0],        // Top row ->
        [4,1], [4,2], [4,3],               // Right col v
        
        // Ring 1 (Inner) - 8 nodes
        [3,3], [2,3], [1,3],               // Bottom inner <-
        [1,2], [1,1],                      // Left inner ^
        [2,1], [3,1],                      // Top inner ->
        [3,2],                             // Right inner v
        
        // Ring 2 (Center) - 1 node
        [2,2]
    ];

    // Map grid coordinates to percentages (10%, 30%, 50%, 70%, 90%)
    const getPos = (index) => (index * 20) + 10;

    for (let i = 0; i < count; i++) {
        // Safety check for count > 25, though we expect 25.
        // If count > 25, validSpiralIndex will be undefined, so we fallback.
        const coord = spiralCoords[i] || [2,2]; 
        
        const x = getPos(coord[0]);
        const y = getPos(coord[1]);

        const isLast = i === count - 1;
        const id = i + 1;

        levels.push({
            id: id,
            name: isLast ? 'Certificate' : `Task ${id}`,
            icon: isLast ? CERTIFICATE_ICON : ICONS[i % ICONS.length],
            stars: 0,
            unlocked: i === 0, // Mock unlock
            hasGift: isLast,
            position: { x, y }
        });
    }
    return levels;
};



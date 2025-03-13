// The retinal model functions
// The functions are developed from retina_model.ipynb using python for easier visualization. They are then transformed to JavaScript.
// Not the most efficient thing to do, but it works, especially for deeper understanding of ON/OFF-RGCs and center/surround responses.

let center_response = [
    -1, -1, -1, -1, -1, //N
    -1, -1, -1, -1, -1, //NE
    -1, -1, -1, -1, -1, //E
    -1, -1, -1, -1, -1, //SE
    -1, -1, -1, -1, -1, //S
    -1, -1, -1, -1, -1, //SW
    -1, -1, -1, -1, -1, //W
    -1, -1, -1, -1, -1, //NW
    1, 1, 1, 1, 1, 1, 1, 1 //Center
];

let surround_response = [
    1, 1, 1, 1, 1, //N
    1, 1, 1, 1, 1, //NE
    1, 1, 1, 1, 1, //E
    1, 1, 1, 1, 1, //SE
    1, 1, 1, 1, 1, //S
    1, 1, 1, 1, 1, //SW
    1, 1, 1, 1, 1, //W
    1, 1, 1, 1, 1, //NW
    -1, -1, -1, -1, -1, -1, -1, -1 //Center 
];

let both_response = [
    1, 1, 1, 1, 1, //N
    1, 1, 1, 1, 1, //NE
    1, 1, 1, 1, 1, //E
    1, 1, 1, 1, 1, //SE
    1, 1, 1, 1, 1, //S
    1, 1, 1, 1, 1, //SW
    1, 1, 1, 1, 1, //W
    1, 1, 1, 1, 1, //NW
    1, 1, 1, 1, 1, 1, 1, 1 //Center 
];

let neither_response = [
    -1, -1, -1, -1, -1, //N
    -1, -1, -1, -1, -1, //NE
    -1, -1, -1, -1, -1, //E
    -1, -1, -1, -1, -1, //SE
    -1, -1, -1, -1, -1, //S
    -1, -1, -1, -1, -1, //SW
    -1, -1, -1, -1, -1, //W
    -1, -1, -1, -1, -1, //NW
    -1, -1, -1, -1, -1, -1, -1, -1 //Center 
];

function chunkArray(arr, chunkSize, chunkNum) {
    let chunks = [];
    let totalChunks = chunkNum;
    
    let startIndex = 0;

    // Loop to create the chunks, preserving chunkSize
    for (let i = 0; i < totalChunks; i++) {
        chunks.push(arr.slice(startIndex, startIndex + chunkSize)); // Regular chunk
        startIndex += chunkSize;
    }

    // Last chunk will take the remaining elements, if any
    chunks.push(arr.slice(startIndex));

    return chunks;
}

function retina(input, unitRod=5, centerUnit=8, surrArea=8) {
    const totalRod = unitRod * surrArea + centerUnit;
    const coeff = 1.5;

    const flip = -1;
    const weightRod = 1 / unitRod;
    const weightCenter = 1 / centerUnit;
    const weightHC = flip * 1 / surrArea;

    if (input.length !== totalRod) {
        const diff = input.length - totalRod;
        return `There might be ${Math.abs(diff)} ${diff > 0 ? "extra" : "missing"} rod(s) in the input?`;
    }

    // Split input into chunks
    const areaInput = chunkArray(input, unitRod, surrArea);

    // Assign area names
    let areaDict = {};
    areaInput.slice(0, -1).forEach((chunk, i) => {
        areaDict[`area_${i + 1}`] = chunk;
    });
    areaDict["area_center"] = areaInput[areaInput.length - 1];

    // Apply transformations
    let areaRodDict = {};
    for (let key in areaDict) {
        areaRodDict[`${key}_rod`] = areaDict[key].map(x => x * flip * weightRod);
    }

    let areaHCDict = {};
    for (let key in areaRodDict) {
        let newKey = key.replace("_rod", "_HC");
        areaHCDict[newKey] = areaRodDict[key].reduce((sum, val) => sum + val, 0) * weightHC;
    }

    // Sum all but last
    let areaHCSum = Object.values(areaHCDict).slice(0, -1).reduce((sum, val) => sum + val, 0);

    // Compute center sum with lateral inhibition
    let areaCenterSum = areaDict["area_center"]
        .map(x => (x * flip + areaHCSum) * weightCenter)
        .reduce((sum, val) => sum + val, 0);

    // Normalize outputs
    let areaCenterLinear = areaCenterSum * 0.5;
    let areaCenterNonlinear = Math.round(Math.tanh(coeff * areaCenterSum) * 100) / 100;

    // ON and OFF Retinal Ganglion Cell (RGC) outputs
    let ON_RGC_linear = Math.round(flip * areaCenterLinear * 100) / 100;
    let OFF_RGC_linear = Math.round(areaCenterLinear * 100) / 100;

    let ON_RGC_nonlinear = flip * areaCenterNonlinear;
    let OFF_RGC_nonlinear = areaCenterNonlinear;

    return [
        areaDict,
        areaHCDict,
        areaHCSum,
        areaCenterSum,
        ON_RGC_linear,
        OFF_RGC_linear,
        ON_RGC_nonlinear,
        OFF_RGC_nonlinear,
        weightRod,
        weightCenter,
        weightHC,
    ];
}

retina(center_response)

// Dragging the Circle (Light stimulus)
const circle = document.getElementById("draggable-circle");
const boundary = document.querySelector(".boundary");

let offsetX, offsetY, isDragging = false;

circle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - circle.offsetLeft;
    offsetY = e.clientY - circle.offsetTop;
    circle.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // Boundary constraints
    const minX = 0, minY = 0;
    const maxX = boundary.clientWidth - circle.clientWidth;
    const maxY = boundary.clientHeight - circle.clientHeight;

    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    detectCollision(x, y)
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    circle.style.cursor = "grab";
});


// Getting the grid
// The grid will be using a custom polar coordinate system
// Not the best one (when it comes to outer rings it loses definition) but it works
const grid = document.getElementById("grid");
const numRings = 6;
const numSectors = 8;

const ringRadii = [40, 56, 72, 88, 104, 120];

function polarToCartesian(angle, radius) {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: radius * Math.cos(rad), y: radius * Math.sin(rad) };
}

function createSector(innerR, outerR, startAngle, endAngle, id) {
    const p1 = polarToCartesian(startAngle, innerR);
    const p2 = polarToCartesian(endAngle, innerR);
    const p3 = polarToCartesian(endAngle, outerR);
    const p4 = polarToCartesian(startAngle, outerR);

    const pathData = `
        M ${p1.x} ${p1.y}
        A ${innerR} ${innerR} 0 0 1 ${p2.x} ${p2.y}
        L ${p3.x} ${p3.y}
        A ${outerR} ${outerR} 0 0 0 ${p4.x} ${p4.y}
        Z
    `;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "none");
    path.setAttribute("stroke-width", "1");
    path.setAttribute("id", `sector-${id}`);

    grid.appendChild(path);
}

function generatePolarGrid() {
    let sectorID = 1;
    for (let r = 0; r < numRings; r++) {
        for (let s = 0; s < numSectors; s++) {
            const innerRadius = r === 0 ? 0 : ringRadii[r - 1]; // Inner radius (0 for first ring)
            const outerRadius = ringRadii[r]; // Outer radius based on your specified values
            const startAngle = (s / numSectors) * 360;
            const endAngle = ((s + 1) / numSectors) * 360;
            createSector(innerRadius, outerRadius, startAngle, endAngle, sectorID);
            sectorID++;
        }
    }
}

generatePolarGrid();


// Getting collision detection running
// Function to calculate distance from center
// Function to calculate angle (0-360 degrees)
// Function to check all edge points of the draggable circle
let circleRadius = 40; // Draggable circle's radius, this will be a variable because I want to change it
let circleCenter = (300 - circleRadius * 2) * 0.5;

document.documentElement.style.setProperty("--block-size", `${circleRadius * 2}px`);
document.documentElement.style.setProperty("--center-position", `${circleCenter + 0.5}px`);

const slider = document.getElementById("radiusSlider");
slider.value = circleRadius; // Set initial slider position

slider.addEventListener("input", function () {
    circleRadius = parseInt(this.value);

    // Update the CSS variable
    document.documentElement.style.setProperty("--block-size", `${circleRadius * 2}px`);
    document.documentElement.style.setProperty("--center-position", `${circleCenter + 0.5}px`);
});

const sectorValues = new Array(numRings * numSectors).fill(-1); // Default all sectors to -1
let orderedSectorValues = new Array(numRings * numSectors).fill(-1);;

function getDistanceFromCenter(x, y) {
    return Math.sqrt(x * x + y * y);
}

function getAngleFromCenter(x, y) {
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    return angle < 0 ? angle + 360 : angle; // Normalize to 0-360 degrees
}

function detectCollision(cx, cy, centerUnit=8) {
    let activeSectors = new Set();

    // Loop through points in a grid inside the circle
    for (let x = -circleRadius; x <= circleRadius; x += 1) {
        for (let y = -circleRadius; y <= circleRadius; y += 1) {
            let checkX = cx - circleCenter + x;
            let checkY = cy - circleCenter + y;

            // Ensure the point is inside the circle
            if (Math.sqrt(x * x + y * y) <= circleRadius) {
                let distance = getDistanceFromCenter(checkX, checkY);
                let angle = getAngleFromCenter(checkX, checkY);

                let ringIndex = ringRadii.findIndex(r => distance <= r);
                let sectorIndex = (Math.floor((angle / 360) * numSectors) + 2) % numSectors;

                if (ringIndex !== -1) {
                    let sectorID = ringIndex * numSectors + sectorIndex;
                    activeSectors.add(sectorID);
                }
            }
        }
    }

    // Reset sector values and activate detected sectors
    sectorValues.fill(-1);
    activeSectors.forEach(index => (sectorValues[index] = 1));
    sectorValues.push(...sectorValues.splice(0, centerUnit));

    let reordered = [];

    // Rearrange first 40 elements
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 5; j++) {
            reordered.push(sectorValues[i + j * 8]);
        }
    }
    
    orderedSectorValues = reordered.concat(sectorValues.slice(40));
}


// Adding event listener on simulation buttons
// const circle is defined waaaaay back
// It also color codes the receptive field and 2d simulation
const simulationButtons = { // Grouping the simulation buttons
    center: document.getElementById("center-response-simulation"),
    surround: document.getElementById("surround-response-simulation"),
    both: document.getElementById("both-response-simulation"),
    neither: document.getElementById("neither-response-simulation"),
    custom: document.getElementById("custom-response-simulation"),
};

const centerArea = document.getElementById("center-area");
const surroundArea = document.getElementById("surround-area");

const surroundRods = document.querySelectorAll(".surround-rod");
const centerRods = document.querySelectorAll(".center-rod");
const bpcs = document.querySelectorAll(".bpc");
const hcs = document.querySelectorAll(".hc");
const rgcs = document.querySelectorAll(".rgc");

function updateSimulation(centerColor, surroundColor, showCircle) { // Color coding the receptive field
    centerArea.style.backgroundColor = centerColor;
    surroundArea.style.backgroundColor = surroundColor;
    circle.style.display = showCircle ? "flex" : "none";
    slider.style.opacity = showCircle ? "1" : "0";
}

function getGradientColor(value) {
    // Ensure value is clamped between -1 and 1
    value = Math.max(-1, Math.min(1, value));

    // Convert range from [-1, 1] to [0, 1] for interpolation
    let normalized = (value + 1) / 2;
    let r, g, b;

    if (normalized < 0.5) {
        // Interpolate from blue (#0000FF) to gray (#808080)
        let t = normalized * 2; // Scale 0-0.5 to 0-1
        r = Math.round(t * 128);  // Transition from 0 to 128
        g = Math.round(t * 128);  // Transition from 0 to 128
        b = Math.round(255 - t * (255 - 128)); // Transition from 255 to 128
    } else {
        // Interpolate from gray (#808080) to yellow (#FFFF00)
        let t = (normalized - 0.5) * 2; // Scale 0.5-1 to 0-1
        r = Math.round(128 + t * (255 - 128)); // Transition from 128 to 255
        g = Math.round(128 + t * (255 - 128)); // Transition from 128 to 255
        b = Math.round(128 - t * 128); // Transition from 128 to 0
    }

    return `rgb(${r}, ${g}, ${b})`;
}



function crossSimulation(retinaResults) {

    const sectorSurrRod2 = retinaResults[0]["area_2"].map(value => -value);
    const sectorSurrRod7 = retinaResults[0]["area_7"].map(value => -value);
    sectorSurrRod7.reverse()

    const sectorSurrRods = [...sectorSurrRod7, ...sectorSurrRod2]

    const sectorCenterRod1 = -retinaResults[0]["area_center"][0];
    const sectorCenterRod2 = -retinaResults[0]["area_center"][1];
    const sectorCenterRod7 = -retinaResults[0]["area_center"][6];
    const sectorCenterRod8 = -retinaResults[0]["area_center"][7];

    const sectorCenterRods = [
        sectorCenterRod7,
        sectorCenterRod8,
        sectorCenterRod1,
        sectorCenterRod2
    ]

    const sectorHC2 = retinaResults[1]["area_2_HC"] / retinaResults[10];
    const sectorHC7 = retinaResults[1]["area_7_HC"] / retinaResults[10];

    const sectorHCs = [sectorHC7, sectorHC2]
    
    const sectorbpc = retinaResults[4];
    const sectorrgc = retinaResults[4];

    const customSectorValues = [
        sectorSurrRods, 
        sectorCenterRods,
        sectorHCs,
        sectorbpc,
        sectorrgc
    ];

    surroundRods.forEach((rod, index) => {
        rod.style.backgroundColor = getGradientColor(customSectorValues[0][index]);
    })
    centerRods.forEach((rod, index) => {
        rod.style.backgroundColor = getGradientColor(customSectorValues[1][index]);
    })
    hcs.forEach((rod, index) => {
        rod.style.backgroundColor = getGradientColor(customSectorValues[2][index]);
    })
    bpcs.forEach((rod) => {
        rod.style.backgroundColor = getGradientColor(customSectorValues[3]);
    })
    rgcs.forEach((rod) => {
        rod.style.backgroundColor = getGradientColor(customSectorValues[4]);
    })
}

let customUpdateInterval; // Store interval reference

simulationButtons.center.addEventListener("click", () => {
    clearInterval(customUpdateInterval);
    updateSimulation("white", "#333", false);
    crossSimulation(retina(center_response))
});
simulationButtons.surround.addEventListener("click", () => {
    clearInterval(customUpdateInterval);
    updateSimulation("#333", "white", false);
    crossSimulation(retina(surround_response))
});
simulationButtons.both.addEventListener("click", () => {
    clearInterval(customUpdateInterval);
    updateSimulation("white", "white", false);
    crossSimulation(retina(both_response))
});
simulationButtons.neither.addEventListener("click", () => {
    clearInterval(customUpdateInterval);
    updateSimulation("#333", "#333", false);
    crossSimulation(retina(neither_response))
});

simulationButtons.custom.addEventListener("click", () => {
    // Run it immediately when button is clicked
    updateCustomSimulation()
    updateSimulation("#333", "#333", true)

    // Clear any existing interval to prevent duplicates
    clearInterval(customUpdateInterval);

    // Start a new interval to keep updating
    customUpdateInterval = setInterval(updateCustomSimulation, 100);
});

function updateCustomSimulation() {
    crossSimulation(retina(orderedSectorValues))
    console.log(orderedSectorValues)
};


// Lines connecting cells to other cells
// surround, center, bpc, hc, rgc are defined before
function connectElements() {
    const svg = document.getElementById("connection-lines");
    svg.innerHTML = ""; // Clear previous lines

    if (hcs.length < 2 || bpcs.length === 0 || rgcs.length === 0) return;

    // Function to create an SVG line
    function drawLine(startEl, endEl, color="yellow", direction="forward", opacity=1) {
        // forward or backward for direction param
        const svg = document.getElementById("connection-lines");
        
        const startRect = startEl.getBoundingClientRect();
        const endRect = endEl.getBoundingClientRect();
        const containerRect = svg.getBoundingClientRect();

        let startX, startY, endX, endY; // Declare variables before using them

        if (direction === "forward") {
            startX = startRect.left - containerRect.left + startRect.width / 2;
            startY = startRect.bottom - containerRect.top;
            endX = endRect.left - containerRect.left + endRect.width / 2;
            endY = endRect.top - containerRect.top;
        } else if (direction === "backward") {
            startX = startRect.left - containerRect.left + startRect.width / 2;
            startY = startRect.top - containerRect.top;
            endX = endRect.left - containerRect.left + endRect.width / 2;
            endY = endRect.bottom - containerRect.top;
        }

        // Create the main line
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", startX);
        line.setAttribute("y1", startY);
        line.setAttribute("x2", endX);
        line.setAttribute("y2", endY);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", "2");
        line.style.opacity = opacity;

        svg.appendChild(line);

        // Compute midpoint for arrowhead
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const angle = Math.atan2(endY - startY, endX - startX); // Angle of the line

        // Create arrowhead (triangle)
        const arrowSize = 8;
        const arrowPoints = [
            [-arrowSize, -arrowSize / 2],
            [0, 0],
            [-arrowSize, arrowSize / 2]
        ]
        .map(([dx, dy]) => {
            const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle);
            const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle);
            return `${midX + rotatedX},${midY + rotatedY}`;
        })
        .join(" ");

        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        arrow.setAttribute("points", arrowPoints);
        arrow.setAttribute("fill", color);
        arrow.style.opacity = opacity;

        svg.appendChild(arrow);
    };


    // Connect first 5 surround rods to the first hc, last 5 to the second hc
    surroundRods.forEach((rod, index) => {
        const hcIndex = index < 5 ? 0 : 1;
        drawLine(rod, hcs[hcIndex]);
    });

    hcs.forEach(hc => 
        centerRods.forEach(centerRod => 
            drawLine(hc, centerRod, "red", "backward", 0.25)
        )
    );

    // Connect center rods to the first bpc
    centerRods.forEach(rodCenter => drawLine(rodCenter, bpcs[0]));

    // Connect bpcs to the first rgc
    bpcs.forEach(bpc => drawLine(bpc, rgcs[0]));
}

window.addEventListener("load", connectElements); // Run the function after the layout loads and on resize
window.addEventListener("resize", connectElements);


// Button functions for the lectures
const sections = {
    "anatomy-button": "lecture1-supercontainer",
    "biochem-button": "lecture2-supercontainer",
    "rf-button": "lecture3-supercontainer",
    "vis-button": "lecture4-supercontainer"
};

document.addEventListener("DOMContentLoaded", () => {
    Object.entries(sections).forEach(([buttonId, sectionId]) => {
        document.getElementById(buttonId).addEventListener("click", () => {
            // Hide all sections
            Object.values(sections).forEach(id => {
                document.getElementById(id).style.display = "none";
            });
            // Show the selected section
            document.getElementById(sectionId).style.display = "flex";
        });
    });

    // Ensure the first section is visible by default
    document.getElementById("lecture1-supercontainer").style.display = "flex";
});


// Smooth anchor transition
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
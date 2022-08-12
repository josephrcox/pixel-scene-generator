const screen = document.getElementById("screen");

let groundLevel = []
const tileSize = 5; // quality of picture
const maxX = Math.round(800 / tileSize);
const maxY = Math.round(600 / tileSize);
let nighttime = false;

function run(override) {
    // generate ground level
    groundLevel = []
    for (let x = 0; x < maxX; x++) {
        groundLevel[x] = Math.floor(getRandomNumber(maxY/1, maxY*1.03) - tileSize) - tileSize*3
        if (groundLevel[x] < maxY/2) {
            groundLevel[x] = (maxY/2) - Math.random() * tileSize/2;
        }
    }

    nighttime = Math.random() > 0.5;

    screen.innerHTML = "";
    for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.style.width = tileSize + "px";
            tile.style.height = tileSize + "px";
            tile.id = x + "-" + y;
            tile.dataset.cloud = "false";
            if (override) {
                tile.style.backgroundColor = getRandomColor(override);
            } else {
                if (y >= groundLevel[x] && y < maxY || (isNextTo(x,y, "green") && Math.random() > 0.7)) {
                    tile.style.backgroundColor = getRandomColor("green", y);
                    tile.dataset.color = "green"
                } else {
                    if ((groundLevel[x] - y) > 2 && (y < (Math.random() * maxY/6))) {
                        if (isNextTo(x,y, "gray") || Math.random() > 0.90) {
                            tile.style.backgroundColor = getRandomColor("gray");

                            tile.dataset.color = "gray";
                        } else {
                            if (nighttime == true) {
                                tile.style.backgroundColor = getRandomColor("night", y);
                            } else {
                                tile.style.backgroundColor = getRandomColor("sky", y);
                            }

                        }
                    } else {
                        if (nighttime == true) {
                            document.body.style.backgroundColor = '#081106'
                            document.getElementById('tip').style.color = 'white'
                            tile.style.backgroundColor = getRandomColor("night", y);
                        } else {
                            document.body.style.backgroundColor = 'white'
                            document.getElementById('tip').style.color = 'black'
                            tile.style.backgroundColor = getRandomColor("sky", y);
                        }
                    }  
                }
            }
            screen.append(tile);
        }
    }
    generateTrees()
}

function generateTrees() {
    let brown = "rgb(102, 51, 0)";
    for (let x=0;x<maxX;x++) {
        if (Math.random() > 0.94) {
            let thickTree = Math.random() > 0.90
            let treeHeight = Math.round(Math.random() * maxY/3) * getRandomNumber(1,2.5);
            if (treeHeight > maxY*0.5) { treeHeight = maxY*0.5 }
            if (treeHeight < maxY*0.1) { treeHeight = maxY*0.1 }
            for (let t=0;t<treeHeight;t++) {
                // 135, 90, 12 is brown we want to base this off of
                let r = 135
                let g = 90
                let b = 12
                let modifier = Math.floor(Math.random() * 90)
                r -= modifier
                g -= modifier
                b -= modifier
                if (b < 0 ) {b = 0}
                brown = "rgb("+r+","+g+","+b+")"
                let e = document.getElementById(x + "-" + (groundLevel[x] - t))
                if (e != null) {
                    e.style.backgroundColor = brown
                }
                if (Math.random() > 0.7 || thickTree) {
                    if (Math.random() > 0.5 || thickTree) {
                        e = document.getElementById((x-1) + "-" + (groundLevel[x] - t))
                        if (e != null) {
                            e.style.backgroundColor = brown
                        }
                    } 
                    e = document.getElementById((x+1) + "-" + (groundLevel[x] - t))
                    if (e != null) {
                        e.style.backgroundColor = brown
                    }
                }
            }
            for (let y=0;y<(Math.floor(Math.random() * 15) + 15);y++) {
                
                let width = (Math.floor(Math.random() * 3) + 3)
                for (let z=(-1 * width);z<(width*2);z++) {
                    let e = document.getElementById(x-z + "-" + (groundLevel[x] - treeHeight - y))
                    if (e!=null) {e.style.backgroundColor = getRandomColor("green", maxY*0.7)}
                }
                
            }
            
        }
    }
}

function getRandomColor(colorBase, y) {
    let color = "rgb("
    let c = 0;
    let brightness = 80
    
    let colorbaseweight = Math.random() * 0.6;
    switch (colorBase) {
        case "red":
            c = (Math.floor(Math.random() * 256) + 240)
            if (c > 255) {c = 255};
            color += c + "," + getRandomRgb(colorbaseweight) + "," + getRandomRgb(colorbaseweight);
            break;
        case "sky":
            if (y != null) {
                brightness = 255 - (255 * (y / (maxY*3))) + 50;
            } 
            if (nighttime == true) {
                brightness = 0
            }

            c = (Math.floor(Math.random() * 256))+brightness
            if (c > 255) {c = 255};
            if (y < maxY/2) {
                if (y < maxY/3) {
                    color += getRandomRgb(colorbaseweight, 50) + "," + getRandomRgb(colorbaseweight, 50) + "," + c;
                } else {
                    color += getRandomRgb(colorbaseweight, 35) + "," + getRandomRgb(colorbaseweight, 35) + "," + c;
                }
                
            } else {
                if (y < maxY*0.8) {
                    color += getRandomRgb(colorbaseweight, 20) + "," + getRandomRgb(colorbaseweight, 20) + "," + c;
                } else {
                    color += getRandomRgb(colorbaseweight) + "," + getRandomRgb(colorbaseweight) + "," + c;
                }

            }
            
            break;
        case "green":
            brightness = 80;
            if (y != null) {
                brightness = 255 - (255 * (y / (maxY*1.1)));
            } 
            if (nighttime == true) {
                brightness -= 80
            }

            c = (Math.floor(Math.random() * 256))+brightness
            if (c > 255) {c = 255};
            color += getRandomRgb(colorbaseweight) + "," + c + "," + getRandomRgb(colorbaseweight);
            break;
        case "gray": 
            if (nighttime == true) { 
                color += "33, 46, 71"
            } else {
                c = (Math.floor(Math.random() * 50) + 180)
                color += c + "," + c + "," + c
            }

            break;
        case "night":
            c = Math.floor(Math.random() * 30)
            color += c + "," + c + "," + c

            break;
        case null:
            color += getRandomRgb() + "," + getRandomRgb() + "," + getRandomRgb();
            break;
    }
    color += ")";

    return color;
}

//get random rgb
function getRandomRgb(override, brightness) {
    if (override) {
        if (brightness) {
            return override * (Math.floor(Math.random() * 256)) + brightness;
        }
        return override * (Math.floor(Math.random() * 256));
    } 
    return Math.floor(Math.random() * 256);
}

//get random number between two numbers
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isNextTo(x,y, color) {
    if (x > 1 && y > 1 && y < maxY - 3 && x < maxX - 5) {
        let left = document.getElementById(x-1 + "-" +y)
        let right = document.getElementById(x+1 + "-" +y)
        let up = document.getElementById(x + "-" + (y-1))
        let down = document.getElementById(x + "-" + (y+1))

        if (left != null && up != null) {
            if (left.dataset.color == color || up.dataset.cloud == color ) {
                return true
            }
        } else {
            console.log(left,right,up,down)
        }
    }
    
    return false;
}

document.addEventListener("keydown", function(e) {
    if (e.keyCode == 13) {
        run()
    }
})

run()
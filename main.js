var cameraX = 0
var cameraY = 0
var cameraZ = 0

var currentPower = 0
var speed = 0
var displaySpeed = 0
var currentDirection = "F"
var mode = "ATP"
var atoStart = false
var atoStop = false
var atpProt = false
var leftDoors = "Open"
var rightDoors = "Closed"
var lastMessage = ""
var isLoaded = false

var atoinfo = 
{
    route: [
            {
                pos: 0,
                speed: 80
            },
            {
                pos: 50000,
                speed: 80
            },
            {
                pos: 55000,
                speed: 60
            },
            {
                pos: 61000,
                speed: 40
            },
            {
                pos: 63500,
                speed: 20
            },
            {
                pos: 65000,
                speed: 0
            },
            {
                pos: (65000 * 2) - 15000,
                speed: 80
            },
            {
                pos: (65000 * 2) - 10000,
                speed: 60
            },
            {
                pos: (65000 * 2) - 4000,
                speed: 40
            },
            {
                pos: (65000 * 2) - 1500,
                speed: 20
            },
            {
                pos: (65000 * 2),
                speed: 0
            },
            {
                pos: (65000 * 3) - 15000,
                speed: 80
            },
            {
                pos: (65000 * 3) - 10000,
                speed: 60
            },
            {
                pos: (65000 * 3) - 4000,
                speed: 40
            },
            {
                pos: (65000 * 3) - 1500,
                speed: 20
            },
            {
                pos: (65000 * 3),
                speed: 0
            },
            {
                pos: (65000 * 4) - 15000,
                speed: 80
            },
            {
                pos: (65000 * 4) - 10000,
                speed: 60
            },
            {
                pos: (65000 * 4) - 4000,
                speed: 40
            },
            {
                pos: (65000 * 4) - 1500,
                speed: 20
            },
            {
                pos: (65000 * 4),
                speed: 0
            },
            {
                pos: (65000 * 5) - 15000,
                speed: 80
            },
            {
                pos: (65000 * 5) - 10000,
                speed: 60
            },
            {
                pos: (65000 * 5) - 4000,
                speed: 40
            },
            {
                pos: (65000 * 5) - 1500,
                speed: 20
            },
            {
                pos: (65000 * 5),
                speed: 0
            },
            {
                pos: (65000 * 6),
                speed: -1
            }
        ]
}

c3dl.addMainCallBack(canvasMain, "canvas");
c3dl.addModel("M2.dae");


var t
window.onresize = () => { clearTimeout(t); t = setTimeout(() => { resEnded() }, 500) }
function resEnded() { var newURL = location.href.split("?")[0]; window.history.pushState('object', document.title, newURL); window.location.href = window.location.href + "?spd=" + speed + "&pos=" + cam.getPosition()[0] + "&pwr=" + document.getElementById("power").value  + "&mode=" + mode + "&leftdoors=" + leftDoors + "&rightdoors=" + rightDoors }

function directionChange() {
    if (mode == "ATO") {
        mode = "ATP"
        newMessage("ATO disabled.")
    }
    if (document.getElementById("direction").value == 1) {
        currentDirection = "B"
    } else if (document.getElementById("direction").value == 2) {
        currentDirection = "N"
    } else if (document.getElementById("direction").value == 3) {
        currentDirection = "F"
    }
}

document.onkeydown = function(e) { 
    switch (e.keyCode) { 
        case 70:
            if (mode == "ATO") {
                newMessage("ATO disabled.")
                mode = "ATP"
            }
            document.getElementById("direction").value ++
            directionChange()
            break
        case 86: 
            if (mode == "ATO") {
                newMessage("ATO disabled.")
                mode = "ATP"
            }
            document.getElementById("direction").value --
            directionChange()
            break
        case 38: 
            cam.pitch(-0.05)
            break
        case 40: 
            cam.pitch(0.05)
            break
        case 39: 
            cam.yaw(-0.05)
            break
        case 37: 
            cam.yaw(0.05)
            break
        case 81:
            if (mode == "ATO") {
                newMessage("ATO disabled.")
                mode = "ATP"
            }
            if (document.getElementById("power").value > 1) {
                document.getElementById("power").value --
                powerChange()
            }
            break
        case 90:
            if (mode == "ATO") {
                newMessage("ATO disabled.")
                mode = "ATP"
            }
            if (document.getElementById("power").value < 13) {
                document.getElementById("power").value ++
                powerChange()
            }
            break
        case 49:
            if (mode == "ATO") {
                newMessage("ATO disabled.")
                mode = "ATP"
            }
            document.getElementById("power").value = 1
            powerChange()
            break
        case 75:
            atoKeyPressed()
            break
        case 53:
            leftDoorsKeyPressed()
            break
        case 54:
            rightDoorsKeyPressed()
            break
    }
}

function rightDoorsKeyPressed() {
	if (speed != 0) {
		return
	}
	if (rightDoors == "Closed") {
		rightDoors = "Open"
	} else {
		rightDoors = "Closed"
	}
}

function leftDoorsKeyPressed() {
	if (speed != 0) {
		return
	}
	if (leftDoors == "Closed") {
		leftDoors = "Open"
	} else {
		leftDoors = "Closed"
	}
}

function atoKeyPressed() {
	atoStop = false
	if (mode == "ATO") {
		newMessage("ATO disabled.")
		mode = "ATP"
		document.getElementById("power").value = 9
		powerChange()
	} else {
		if (leftDoors == "Closed" && rightDoors == "Closed") {
			document.getElementById("direction").value = 3
			directionChange()
			if (displaySpeed == 0 && document.getElementById("power").value < 9) {
				atoStart = true
			}
			mode = "ATO"
			newMessage("ATO enabled.")
		} else {
			newMessage("Cannot enable ATO. Close the doors.")
		}
	}
}

function powerNotchClicked() {
	if (mode == "ATO") {
		newMessage("ATO disabled.")
		mode = "ATP"
	}
	powerChange()
}

function help() {
    alert("Move power handle backwards: Q\nMove power handle forwards: Z\nEmergency brake: 1\nYou can click the power notches to move the handle as well.\n\nChange direction: F/V\n\nEnable/Disable ATO (Automatic Train Operation): K\n\nOpen/close the left side doors: 5\nOpen/close the right side doors: 6\n\nUse the arrow keys to look around.\n\nDo not exceed 80 km/h.")
}

function atp() {
    if (Math.abs(displaySpeed) > 90) {
        atpProt = true
        newMessage("Overspeed detected, emergency brakes applied.")
    }
    if (Math.abs(displaySpeed) < 80) {
        atpProt = false
    }
    if (atpProt == true) {
        document.getElementById("power").value = 1
        powerChange()
    }
}

function ato() {
    if (!(leftDoors == "Closed" && rightDoors == "Closed")) {
        mode = "ATP"
        return
    }
    loop1:
    for (var i = 0; i < atoinfo.route.length; i++) {
        waypoint = atoinfo.route[i]
        if (waypoint.pos > cam.getPosition()[0]) {
            if (atpProt == true) {
                break loop1
            }
            if (atoStart == true && waypoint.speed == 0) {
                document.getElementById("power").value = 13
                powerChange()
                break loop1
            } else {
                atoStart = false
            }
            if (waypoint.speed == 0 && atoStart == false) {
                atoStop = true
            }
            if (atoStop == true && speed == 0) {
                mode = "ATP"
                document.getElementById("power").value = 2
                powerChange()
                leftDoors = "Open"
                atoStop = false
                newMessage("Stopped at the station.")
                break loop1
            }
            if ((waypoint.speed < displaySpeed) && (Math.abs(waypoint.speed - displaySpeed) > 25)) {
                document.getElementById("power").value = 1
                powerChange()
                break loop1
            }
            if (atoStop == true && waypoint.speed > 0) {
                document.getElementById("power").value = 1
                powerChange()
                break loop1
            }
            if (atoStop == true) {
                if (Math.abs(waypoint.speed - displaySpeed) > 7) {
                    document.getElementById("power").value = 2
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 6) {
                    document.getElementById("power").value = 3
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 5) {
                    document.getElementById("power").value = 4
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 4) {
                    document.getElementById("power").value = 5
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 3) {
                    document.getElementById("power").value = 6
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 2) {
                    document.getElementById("power").value = 7
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 1) {
                    document.getElementById("power").value = 8
                    powerChange()
                }
                break loop1;
            }
            if (waypoint.speed > displaySpeed) {
                if ((waypoint.speed - displaySpeed) > 4) {
                    document.getElementById("power").value = 13
                    powerChange()
                } else if ((waypoint.speed - displaySpeed) > 3) {
                    document.getElementById("power").value = 12
                    powerChange()
                } else if ((waypoint.speed - displaySpeed) > 2) {
                    document.getElementById("power").value = 11
                    powerChange()
                } else if ((waypoint.speed - displaySpeed) > 1) {
                    document.getElementById("power").value = 10
                    powerChange()
                }
            } else if (waypoint.speed < displaySpeed) {
                if (Math.abs(waypoint.speed - displaySpeed) > 7) {
                    document.getElementById("power").value = 2
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 6) {
                    document.getElementById("power").value = 3
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 5) {
                    document.getElementById("power").value = 4
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 4) {
                    document.getElementById("power").value = 5
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 3) {
                    document.getElementById("power").value = 6
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 2) {
                    document.getElementById("power").value = 7
                    powerChange()
                } else if (Math.abs(waypoint.speed - displaySpeed) > 1) {
                    document.getElementById("power").value = 8
                    powerChange()
                }
            } else {
                if (displaySpeed == 0) {
                    document.getElementById("power").value = 2
                    powerChange()
                } else {
                    document.getElementById("power").value = 9
                    powerChange()
                }
            }
            if (displaySpeed == 0 && document.getElementById("power").value < 9) {
                mode = "ATP"
            }
            break loop1
        }
    }
}

function newMessage(msg) {
    if (lastMessage != msg) {
        messagesDiv = document.getElementById("messagesdiv")
        lastMessage = msg
        var d = new Date()
        messagesDiv.insertAdjacentHTML("beforeend", "<p><b>" + d.toLocaleTimeString() + "</b> " + msg + "</p>")
        messagesDiv.scrollTop = messagesDiv.scrollHeight
    }
}

function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;

function start() {
    requestAnimationFrame(update);
}

function update(timestamp) {
    requestAnimationFrame(update);
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;

	if (isLoaded == false) {
		return
	}

    displaySpeed = Math.round(speed * 50)

    if (leftDoors == "Closed" && rightDoors == "Closed") {
        if (currentPower > 0) {
            if (currentDirection == "F") {
                speed = speed + scale(currentPower, 0, 3, 0, 1) / 1000
            } else if (currentDirection == "B") {
                speed = speed - scale(currentPower, 0, 3, 0, 1) / 1000
            }
        } else if (currentPower < 0) {
            if (speed < 0) {
                if (displaySpeed > -0.3) {
                    speed = 0
                } else {
                    speed = speed + scale(currentPower, 0, -8, 0, 1) / 350
                }
            } else if (speed > 0) {
                if (displaySpeed < 0.3) {
                    speed = 0
                } else {
                    speed = speed - scale(currentPower, 0, -8, 0, 1) / 350
                }
            }
        }
    }

    cam.setLinearVel(new Array(speed, 0, 0))
    document.getElementById("speedo").innerHTML = displaySpeed + " km/h"
    document.getElementById("mode").innerHTML = mode
    if (atpProt == true) {
        document.getElementById("speedo").style.color = "red"
    } else if (Math.abs(displaySpeed) > 80) {
        document.getElementById("speedo").style.color = "orange"
    } else {
        document.getElementById("speedo").style.color = "white"
    }

    document.getElementById("traveled").innerHTML = Math.round((cam.getPosition()[0]) / 50) + " m"
    document.getElementById("leftdoors").innerHTML = leftDoors
    document.getElementById("rightdoors").innerHTML = rightDoors

    atp()

    if (mode == "ATO") {
        ato()
    }
}

start();

function powerChange() {
    currentPower = document.getElementById("power").value - 9
    if (currentPower > -1) {
		if (leftDoors != "Closed" || rightDoors != "Closed") {
			newMessage("Cannot move, close the doors.")
		}
    }
}

function canvasMain() {
	let params = (new URL(document.location)).searchParams;
	if (params.get("leftdoors")) {
		leftDoors = params.get("leftdoors")
	}
	if (params.get("rightdoors")) {
		rightDoors = params.get("rightdoors")
	}
	if (params.get("pwr")) {
		document.getElementById("power").value = parseInt(params.get("pwr"))
        powerChange()
	}
	if (params.get("spd")) {
		speed = parseFloat(params.get("spd"))
	}
	if (params.get("mode")) {
		mode = params.get("mode")
	}
    document.getElementById("canvas").width = window.innerWidth
    document.getElementById("canvas").height = window.innerHeight
    scn = new c3dl.Scene();
    scn.setCanvasTag("canvas");
    scn.setBackgroundColor(new Array(0, 0, 0))
    renderer = new c3dl.WebGL();
    renderer.createRenderer(this);
    scn.setRenderer(renderer);
    scn.init("canvas");
    if (renderer.isReady()) {
        duck = new c3dl.Collada();
        duck.init("M2.dae");
        scn.addObjectToScene(duck);
        cam = new c3dl.FreeCamera();
		if (params.get('pos')) {
			cam.setPosition(new Array(Math.floor(parseInt(params.get('pos'))), 50, 80));
		} else {
			cam.setPosition(new Array(0, 50, 80));
		}
        cam.setLookAtPoint(new Array(400000,50,80));
        cam.yaw(-0.01)
        cam.setFarClippingPlane(9000)
        cam.setFieldOfView(40)
		cam.setLinearVel(new Array(0, 0, 0))
        scn.setCamera(cam);
        scn.startScene();
    }
	var newURL = location.href.split("?")[0];
    window.history.pushState('object', document.title, newURL);
    newMessage("Startup completed.")
	isLoaded = true
}
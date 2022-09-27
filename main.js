const carCanvas = document.getElementById("carCanvas");
const networkCanvas = document.getElementById("networkCanvas");
carCanvas.height = window.innerHeight;
carCanvas.width = 300;
networkCanvas.width = 500;


const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const numRoads = 5;
const carRoad = Math.floor(Math.random() * numRoads);

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, numRoads);
//const car = new Car(road.getLaneCenter(carRoad), 100, 30, 50, "AI");
const cars = generateCars(300);

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY"),
    new Car(road.getLaneCenter(2), -400, 30, 50, "DUMMY"),
    new Car(road.getLaneCenter(3), -200, 30, 50, "DUMMY"),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY")
]
const initialDistanceToLastTraffic = traffic.find(car => car.y == Math.min(...traffic.map(car => car.y))).y - cars[0].y;
let bestDistanceToLastTraffic = initialDistanceToLastTraffic;

let bestCar = cars[0];

restoreBrain();

animate();

function generateCars(N) {
    const cars = [];
    for (let i = 0; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars;
}


function restoreBrain() {
    if (localStorage.getItem("bestBrain")) {
        cars.forEach(car => car.brain = JSON.parse(localStorage.getItem("bestBrain")));
        cars.map((car, i) => {
            if (i != 0) {
                NeuralNetwork.mutate(car.brain, 0.2);
            }
        });
    }

}

function saveBrain() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));

}

function discardBrain() {
    localStorage.removeItem("bestBrain");
    localStorage.removeItem("bestBrainUUID");
    location.reload();
}

function fitnessTestLongestDistance() {
    return cars.find(c => c.y == Math.min(...cars.map(c => c.y)));
}

function fitnessTestRelativeToTraffic() {
    const lastTrafficPos = traffic.find(car => car.y == Math.min(...traffic.map(car => car.y)));

    let findBestCar = bestCar;
    for (let i = 0; i < cars.length; i++) {
        let distanceToLastTraffic = lastTrafficPos.y - cars[i].y;
        if (distanceToLastTraffic > bestDistanceToLastTraffic && (distanceToLastTraffic >= initialDistanceToLastTraffic)) {
            //console.log(distanceToLastTraffic, bestDistanceToLastTraffic, initialDistanceToLastTraffic)
            bestDistanceToLastTraffic = distanceToLastTraffic;
            findBestCar = cars[i];
        }
    }
    return findBestCar;
}

function restartAfter(currentTime, time) {
    if (currentTime / 1000 > time) {
        saveBrain();
        location.reload();
    }
}

function animate(time) {
    // refreshes drawing of canvases
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;


    traffic.forEach(car => car.update(road.borders, []));
    cars.forEach(car => car.update(road.borders, traffic));

    //bestCar = fitnessTestLongestDistance();
    bestCar = fitnessTestRelativeToTraffic();

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.8);

    // draw road
    road.draw(carCtx);


    // draw car
    carCtx.globalAlpha = 0.2
    cars.forEach(car => car.draw(carCtx));
    carCtx.globalAlpha = 1
    bestCar.draw(carCtx, true);
    traffic.forEach(car => car.draw(carCtx));

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);

    restartAfter(time, 10);
}
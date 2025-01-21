const graph = new Graph(15);
function setup() {
    createCanvas(1500, 1000);

    // Insert Node in the graph : 
    for(let i = 0; i < 30; i++) {
        graph.addVertex(i, createVector(random(10, width - 10), random(10, height - 10)));
    }

    // Insert Edge in the graph : 
    for(let i = 0; i < graph.size; i++) {
        for(let j = i + 1; j < graph.size; j++) {
            graph.addEdge(i, j);
        }
    }

    for(let i = 0; i < graph.size; i++) {
        graph.vertex[i].setColor(color(
            random(0, 255),
            random(0, 255),
            random(0, 255)
        ));
    }
}

function draw() {
    background(0);
    graph.draw();
    graph.forceDirectedUpdate();
}
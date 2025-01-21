// Class Vertex which represented the vertex of graph.....
class Vertex {
    constructor(id, pos) {
        this.id = id;
        this.pos = pos;
        this.r = 25;
        this.col = color(255);
    }
    setRedious(r) {
        this.r = r;
    }
    setColor(col) {
        this.col = col;
    }
    draw() {
        noStroke();
        fill(this.col);
        ellipse(this.pos.x, this.pos.y, 2 * this.r, 2 * this.r);
    }
    add(v) {
        this.pos.x += v.x;
        this.pos.y += v.y;

        this.pos.x = constrain(this.pos.x, 0, width);
        this.pos.y = constrain(this.pos.y, 0, height);
    }
}

// Class Edge which represented the edge of graph........
class Edge {
    constructor(src, dest) {
        this.src = src;
        this.dest = dest;
    }
    draw(u, v) {
        stroke(225);
        line(u.pos.x, u.pos.y, v.pos.x, v.pos.y);
    }
}


////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

class Graph {
    constructor(k) {
        this.vertex = [];
        this.graph = {};
        this.size = 0;

        // Variable for fource Directed algo....
        this.k = k;
        this.t = 10;
    }

    // Add Vertex.....
    addVertex(id, pos) {
        this.vertex[id] = new Vertex(id, pos);
        this.graph[id] = [];
        this.size++;
    }

    // Add Edge.......
    addEdge(src, dest) {
        if(!this.graph[src] || !this.graph[dest]) {
            console.error("Vertex not found");
        } else {
            this.graph[src].push(new Edge(src, dest));
            this.graph[dest].push(new Edge(dest, src));
        }
    }

    // Draw method......
    draw() {
        // Draw All vertex.....
        this.vertex.forEach((v) => {
            v.draw();
        });

        // Draw All Edges.....
        for(let key in this.graph) {
            for(let edge of this.graph[key]) {
                let src = this.vertex[edge.src];
                let dest = this.vertex[edge.dest];
                edge.draw(src, dest);
            }
        }
    }

    // View The graph.......
    viewGraph() {
        for(let key in this.graph) {
            console.table(this.graph[key]);
        }
    }

    // Force Dirceted Algorithm.......
    forceDirectedUpdate() {
        // Calculate force for eatch vertex...
        for(let v = 0; v < this.size; v++) {
            const nodeV = this.vertex[v];
            nodeV.disp = createVector(0, 0);

            // Calculate Repulsive forces....
            for(let u = 0; u < this.size; u++) {
                if(u !== v) {
                    const nodeU = this.vertex[u];
                    const delta = p5.Vector.sub(nodeV.pos, nodeU.pos);
                    const distance = max(0.01, delta.mag());
                    let repulsiveForce = p5.Vector.div(delta, distance);
                    repulsiveForce.mult((this.k ** 2) / distance);
                    nodeV.disp.add(repulsiveForce);
                }
            }

            // Calculate Atructive forces....
            for(let edge of this.graph[v]) {
                const nodeU = this.vertex[edge.dest];
                const delta = p5.Vector.sub(nodeU.pos, nodeV.pos);
                const distance = max(0.01, delta.mag);
                const attractiveForce = p5.Vector.div(delta, distance);
                attractiveForce.mult((distance ** 2) / this.k);
                nodeV.disp.add(attractiveForce);
            }
        }


        // Update position and limit displacement....
        for(let v = 0; v < this.size; v++) {
            const nodeV = this.vertex[v];
            // Calculate the normalize displacement vector and scale it by the minimum of 
            // displacement magnitude and 't'......
            const meg = nodeV.disp.mag();
            const normalizeDisp = p5.Vector.div(nodeV.disp, meg);
            const scaledDisp = normalizeDisp.mult(meg);

            // Update the position by adding the scaledDisp vector....
            nodeV.add(scaledDisp);
        }
        this.t *= 0.9999;
    }
}

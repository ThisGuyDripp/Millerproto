class DiagramHandler {
    constructor() {
        this.canvas = document.getElementById('diagram');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 100; // pixels per unit
        this.center = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
        this.initializeControls();
    }

    initializeControls() {
        document.getElementById('reset-view').addEventListener('click', 
            () => this.resetView());
        document.getElementById('toggle-grid').addEventListener('click', 
            () => this.toggleGrid());
        this.showGrid = true;
    }

    resetView() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCoordinateSystem();
    }

    toggleGrid() {
        this.showGrid = !this.showGrid;
        this.resetView();
    }

    drawCoordinateSystem() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid if enabled
        if (this.showGrid) {
            this.drawGrid();
        }

        // Draw axes
        this.ctx.lineWidth = 2;
        
        // X-axis (red)
        this.ctx.strokeStyle = '#ff0000';
        this.drawAxis(0, this.center.y, this.canvas.width, this.center.y);
        
        // Y-axis (green)
        this.ctx.strokeStyle = '#00ff00';
        this.drawAxis(this.center.x, 0, this.center.x, this.canvas.height);
        
        // Z-axis (blue, isometric projection)
        this.ctx.strokeStyle = '#0000ff';
        this.drawIsometricAxis();

        // Add labels
        this.drawLabels();
    }

    drawAxis(startX, startY, endX, endY) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        
        // Draw arrow
        this.drawArrow(endX, endY, Math.atan2(endY - startY, endX - startX));
    }

    drawIsometricAxis() {
        const angle = Math.PI / 6; // 30 degrees
        const length = 200;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.center.x, this.center.y);
        const endX = this.center.x + length * Math.cos(angle);
        const endY = this.center.y - length * Math.sin(angle);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        
        this.drawArrow(endX, endY, angle);
    }

    drawArrow(x, y, angle) {
        const arrowSize = 10;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x - arrowSize * Math.cos(angle - Math.PI/6),
            y - arrowSize * Math.sin(angle - Math.PI/6)
        );
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x - arrowSize * Math.cos(angle + Math.PI/6),
            y - arrowSize * Math.sin(angle + Math.PI/6)
        );
        this.ctx.stroke();
    }

    drawGrid() {
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 0.5;
        
        // Draw horizontal and vertical grid lines
        for (let i = 0; i < this.canvas.width; i += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }
    }

    drawLabels() {
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#000';
        
        // X-axis label
        this.ctx.fillText('X', this.canvas.width - 20, this.center.y - 5);
        
        // Y-axis label
        this.ctx.fillText('Y', this.center.x + 5, 20);
        
        // Z-axis label
        this.ctx.fillText('Z', 
            this.center.x + 100 * Math.cos(Math.PI/6),
            this.center.y - 100 * Math.sin(Math.PI/6) - 5
        );
    }

    updateDiagram(intercepts, millerIndices) {
        this.resetView();
        this.drawPlane(intercepts, millerIndices);
    }

    drawPlane(intercepts, millerIndices) {
        // Drawing the plane as a triangle connecting the intercepts
        this.ctx.strokeStyle = '#800080'; // Purple
        this.ctx.lineWidth = 2;
        
        const points = this.calculatePlanePoints(intercepts);
        
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Add some transparency to the fill
        this.ctx.fillStyle = 'rgba(128, 0, 128, 0.2)';
        this.ctx.fill();
    }

    calculatePlanePoints(intercepts) {
        // Convert intercepts to screen coordinates
        return intercepts.map((value, index) => {
            if (value === 0) return null;
            
            let x = this.center.x;
            let y = this.center.y;
            
            switch(index) {
                case 0: // X-intercept
                    x += value * this.scale;
                    break;
                case 1: // Y-intercept
                    y -= value * this.scale;
                    break;
                case 2: // Z-intercept (isometric projection)
                    x += value * this.scale * Math.cos(Math.PI/6);
                    y -= value * this.scale * Math.sin(Math.PI/6);
                    break;
            }
            
            return {x, y};
        }).filter(point => point !== null);
    }
}

const diagramHandler = new DiagramHandler();
document.addEventListener('DOMContentLoaded', () => {
    diagramHandler.drawCoordinateSystem();
});

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mouseout', endDrawing);

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function draw(e) {
        if (!isDrawing) return;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function endDrawing() {
        isDrawing = false;
    }

    document.getElementById('clearBtn').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('saveBtn').addEventListener('click', async () => {
        const canvas = document.getElementById('canvas');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }
    
        const image = canvas.toDataURL();
    
        try {
            const response = await fetch('/save-drawing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image })
            });
    
            if (response.ok) {
                const result = await response.text(); // Adjust if you expect JSON
                console.log("Server response:", result);
            } else {
                console.error("Server error:", response.status, response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    });
    

    document.getElementById('shareBtn').addEventListener('click', async () => {
        const shareLink = document.getElementById('shareLink');
        const image = canvas.toDataURL();

        try {
            const response = await fetch('/save-drawing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image })
            });

            const data = await response.json();
            const drawingId = data._id; // Assuming server returns an ID for the saved drawing
            shareLink.value = `http://localhost:8080/view-drawing?id=${drawingId}`;
        } catch (err) {
            console.error('Error sharing drawing:', err);
        }
    });
});

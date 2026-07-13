document.addEventListener('DOMContentLoaded', () => {
    
    function renderChart(container) {
        const type = container.getAttribute('data-current-type');
        const rawData = container.getAttribute(`data-points-${type}`);
        const rawYears = container.getAttribute('data-years');
        
        if (!rawData || !rawYears) return; 
        
        const points = rawData.split(',').map(Number);
        const years = rawYears.split(',').map(y => y.trim());
        
        const trend = container.getAttribute('data-trend') || 'demographics'; 
        
        const colors = {
            demographics: { line: '#2563eb', fill: 'rgba(37, 99, 235, 0.1)' }, 
            economics:    { line: '#0d9488', fill: 'rgba(13, 148, 136, 0.1)' }, 
            housing:      { line: '#4f46e5', fill: 'rgba(79, 70, 229, 0.1)' }, 
            neutral:      { line: '#4b5563', fill: 'rgba(75, 85, 99, 0.1)' }   
        };
        
        const color = colors[trend] || colors.demographics;

        const width = 200;
        const height = 76; 
        const paddingTop = 32; 
        const paddingBottom = 6; 
        
        const max = Math.max(...points);
        const min = Math.min(...points);
        const range = (max - min) || 1; 
        const stepX = width / (points.length - 1);
        const usableHeight = height - paddingTop - paddingBottom;

        const pathCoords = points.map((p, i) => {
            const x = i * stepX;
            const y = paddingTop + usableHeight - ((p - min) / range) * usableHeight;
            return { x, y, val: p, year: years[i] };
        });

        const linePath = `M ${pathCoords.map(c => `${c.x},${c.y}`).join(' L ')}`;
        const fillPath = `${linePath} L ${width},${height} L 0,${height} Z`;

        // Force container to relative positioning so the absolute HTML tooltip aligns to it
        container.style.position = 'relative';

        // Note the removal of the <text> node and the addition of the HTML div tooltip
        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="none" style="display: block; overflow: visible;">
                <path d="${fillPath}" fill="${color.fill}" stroke="none"></path>
                <path class="animated-line" d="${linePath}" fill="none" stroke="${color.line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                <line class="scrubber" y1="${paddingTop}" y2="${height}" stroke="#9ca3af" stroke-width="1" stroke-dasharray="2,2" opacity="0"></line>
                <circle class="scrubber-dot" r="4" fill="${color.line}" opacity="0"></circle>
            </svg>
            <div class="hover-text-html" style="position: absolute; top: 0; left: 0; font-family: inherit; font-size: 12px; font-weight: 400; color: #4b5563; opacity: 0; pointer-events: none; white-space: nowrap;"></div>
        `;

        const animatedLine = container.querySelector('.animated-line');
        const pathLength = animatedLine.getTotalLength();
        animatedLine.style.strokeDasharray = pathLength;
        animatedLine.style.strokeDashoffset = pathLength;
        animatedLine.style.animation = 'none'; 
        container.offsetHeight; 
        animatedLine.style.animation = 'drawLine 1.5s ease-out forwards';

        const svg = container.querySelector('svg');
        const scrubber = container.querySelector('.scrubber');
        const dot = container.querySelector('.scrubber-dot');
        const hoverText = container.querySelector('.hover-text-html'); // Targeting the HTML div
        
        const card = container.closest('.sdo-stat-card');

        container.addEventListener('mousemove', (e) => {
            const rect = svg.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * width; 
            
            let closestIndex = Math.round(mouseX / stepX);
            closestIndex = Math.max(0, Math.min(closestIndex, points.length - 1));
            const point = pathCoords[closestIndex];

            scrubber.setAttribute('opacity', '1');
            scrubber.setAttribute('x1', point.x);
            scrubber.setAttribute('x2', point.x);
            
            dot.setAttribute('opacity', '1');
            dot.setAttribute('cx', point.x);
            dot.setAttribute('cy', point.y);

            hoverText.style.opacity = '1';
            
            const activeToggle = card.querySelector('.sdo-toggle-btn.active');
            const format = activeToggle ? activeToggle.getAttribute('data-format') : 'percent';
            
            if (format === 'comma') {
                hoverText.textContent = `${point.year}: ${point.val.toLocaleString()}`;
            } else if (format === 'currency') {
                hoverText.textContent = `${point.year}: $${point.val.toLocaleString()}`;
            } else {
                hoverText.textContent = `${point.year}: ${point.val}%`;
            }
            
            // Positioning logic for standard HTML using percentages
            const leftPct = (point.x / width) * 100;
            hoverText.style.left = `${leftPct}%`;
            
            if (leftPct < 20) {
                hoverText.style.transform = 'translateX(0)'; // Anchor start
            } else if (leftPct > 80) {
                hoverText.style.transform = 'translateX(-100%)'; // Anchor end
            } else {
                hoverText.style.transform = 'translateX(-50%)'; // Anchor middle
            }
        });

        container.addEventListener('mouseleave', () => {
            scrubber.setAttribute('opacity', '0');
            dot.setAttribute('opacity', '0');
            hoverText.style.opacity = '0';
        });
    }

    const cards = document.querySelectorAll('.sdo-stat-card');
    
    cards.forEach(card => {
        const sparkline = card.querySelector('.sdo-sparkline');
        const toggles = card.querySelectorAll('.sdo-toggle-btn');
        
        if (sparkline) renderChart(sparkline);

        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                if (e.target.classList.contains('active')) return; 
                
                toggles.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                const targetData = e.target.getAttribute('data-target');
                sparkline.setAttribute('data-current-type', targetData);
                renderChart(sparkline);
            });
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    
    function renderChart(container) {
        const rawData = container.getAttribute('data-points');
        const rawYears = container.getAttribute('data-years');
        const currentIndex = parseInt(container.getAttribute('data-current-index'));
        const card = container.closest('.sdo-stat-card-interior');
        const themeKey = card ? card.getAttribute('data-theme') : 'pop';
        
        if (!rawData || !rawYears) return; 
        
        const points = rawData.split(',').map(Number);
        const years = rawYears.split(',').map(y => y.trim());
        
        const colors = {
            pop:     { line: '#2563eb', fill: 'rgba(37, 99, 235, 0.1)' }, 
            econ:    { line: '#059669', fill: 'rgba(5, 150, 105, 0.1)' }, 
            housing: { line: '#7c3aed', fill: 'rgba(124, 58, 237, 0.1)' }   
        };
        const color = colors[themeKey] || colors['pop'];

        const width = 200;
        const height = 90; 
        const paddingTop = 20; 
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

        const pastCoords = pathCoords.slice(0, currentIndex + 1);
        const futureCoords = pathCoords.slice(currentIndex);

        const linePathPast = `M ${pastCoords.map(c => `${c.x},${c.y}`).join(' L ')}`;
        const linePathFuture = `M ${futureCoords.map(c => `${c.x},${c.y}`).join(' L ')}`;
        const fillPath = `M ${pathCoords.map(c => `${c.x},${c.y}`).join(' L ')} L ${width},${height} L 0,${height} Z`;

        const anchorPoint = pathCoords[currentIndex];
        const anchorLeftPct = (anchorPoint.x / width) * 100;
        const anchorTopPct = (anchorPoint.y / height) * 100;

        // Bulletproof dynamic label positioning (Only target the middle label)
        const midLabel = container.parentNode.querySelector('.sdo-lbl-mid');
        if (midLabel) {
            midLabel.style.left = `${anchorLeftPct}%`;
        }

        const clipId = 'wipe-mask-' + Math.random().toString(36).substr(2, 9);

        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="none" style="display: block; overflow: visible;">
                <defs>
                    <clipPath id="${clipId}">
                        <rect class="svg-wipe-rect" x="-5" y="-5" width="0" height="${height + 10}"></rect>
                    </clipPath>
                </defs>
                <g clip-path="url(#${clipId})">
                    <path d="${fillPath}" fill="${color.fill}" stroke="none"></path>
                    <path d="${linePathPast}" fill="none" stroke="${color.line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="${linePathFuture}" fill="none" stroke="${color.line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3, 4"></path>
                </g>
                <line class="scrubber" y1="0" y2="${height}" stroke="#9ca3af" stroke-width="1" stroke-dasharray="2,2" opacity="0"></line>
            </svg>
            <div style="position: absolute; width: 8px; height: 8px; border: 2px solid #fff; border-radius: 50%; background-color: ${color.line}; left: ${anchorLeftPct}%; top: ${anchorTopPct}%; transform: translate(-50%, -50%); z-index: 5;"></div>
            <div class="scrubber-dot-html" style="position: absolute; width: 10px; height: 10px; border-radius: 50%; background-color: ${color.line}; opacity: 0; pointer-events: none; transform: translate(-50%, -50%); z-index: 10; box-shadow: 0 0 0 2px rgba(255,255,255,0.8);"></div>
            <div class="hover-text-html" style="position: absolute; top: -10px; left: 0; font-family: inherit; font-size: 13px; font-weight: 600; color: #374151; background: rgba(255,255,255,0.9); padding: 2px 6px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); opacity: 0; pointer-events: none; white-space: nowrap; z-index: 10;"></div>
        `;

        const wipeRect = container.querySelector('.svg-wipe-rect');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    wipeRect.animate([
                        { width: '0px' },
                        { width: `${width + 10}px` }
                    ], {
                        duration: 1500,
                        easing: 'ease-out',
                        fill: 'forwards'
                    });
                    observer.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(container);

        const svg = container.querySelector('svg');
        const scrubber = container.querySelector('.scrubber');
        const dot = container.querySelector('.scrubber-dot-html');
        const hoverText = container.querySelector('.hover-text-html'); 

        container.addEventListener('mousemove', (e) => {
            const rect = svg.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * width; 
            
            let closestIndex = Math.round(mouseX / stepX);
            closestIndex = Math.max(0, Math.min(closestIndex, points.length - 1));
            const point = pathCoords[closestIndex];

            scrubber.setAttribute('opacity', '1');
            scrubber.setAttribute('x1', point.x);
            scrubber.setAttribute('x2', point.x);
            
            const leftPct = (point.x / width) * 100;
            const topPct = (point.y / height) * 100;
            
            dot.style.opacity = '1';
            dot.style.left = `${leftPct}%`;
            dot.style.top = `${topPct}%`;

            hoverText.style.opacity = '1';
            hoverText.textContent = `${point.year}: ${point.val.toLocaleString()}`;
            hoverText.style.left = `${leftPct}%`;
            
            if (leftPct < 20) {
                hoverText.style.transform = 'translateX(0)'; 
            } else if (leftPct > 80) {
                hoverText.style.transform = 'translateX(-100%)'; 
            } else {
                hoverText.style.transform = 'translateX(-50%)'; 
            }
        });

        container.addEventListener('mouseleave', () => {
            scrubber.setAttribute('opacity', '0');
            dot.style.opacity = '0';
            hoverText.style.opacity = '0';
        });
    }

    const sparklines = document.querySelectorAll('.sdo-sparkline');
    sparklines.forEach(chart => renderChart(chart));
});
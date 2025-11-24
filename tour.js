// Tour Virtual 360 - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    const hotspots = document.querySelectorAll('.hotspot');
    const infoPanel = document.getElementById('infoPanel');
    const infoContent = document.getElementById('infoContent');
    const closeBtn = document.getElementById('closeBtn');
    const panorama = document.getElementById('panorama');
    const panoramaContainer = document.querySelector('.panorama-container');
    
    
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    
    let isDragging = false;
    let startX, scrollLeft;
    let currentScroll = 0;
    const panoramaWidth = panorama.scrollWidth;
    const containerWidth = panoramaContainer.offsetWidth;
    
    
    function updateHotspotsPosition(scrollOffset) {
        const scrollPercentage = (scrollOffset / (panoramaWidth - containerWidth)) * 100;
        
        hotspots.forEach(hotspot => {
            const originalLeft = parseFloat(hotspot.style.left);
            
            const newPosition = (originalLeft - scrollPercentage + 100) % 100;
            hotspot.style.left = newPosition + '%';
        });
    }
    
    
    function showInfo(targetId) {
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            infoContent.innerHTML = targetContent.innerHTML;
            infoPanel.classList.add('active');
            overlay.classList.add('active');
            
            
            const pdfButtons = infoContent.querySelectorAll('.pdf-btn');
            pdfButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const pdfUrl = this.getAttribute('data-pdf');
                    if (pdfUrl) {
                        window.open(pdfUrl, '_blank');
                    }
                });
            });
        }
    }
    
    
    function closeInfoPanel() {
        infoPanel.classList.remove('active');
        overlay.classList.remove('active');
    }
    
    
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', function(e) {
            e.stopPropagation(); 
            const targetId = this.getAttribute('data-target');
            showInfo(targetId);
        });
    });
    
    closeBtn.addEventListener('click', closeInfoPanel);
    overlay.addEventListener('click', closeInfoPanel);
    
    
    panoramaContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - panoramaContainer.offsetLeft;
        scrollLeft = currentScroll;
        panoramaContainer.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    panoramaContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        panoramaContainer.style.cursor = 'grab';
    });
    
    panoramaContainer.addEventListener('mouseup', () => {
        isDragging = false;
        panoramaContainer.style.cursor = 'grab';
    });
    
    panoramaContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - panoramaContainer.offsetLeft;
        const walk = (x - startX) * 3; 
        
        
        let newScroll = scrollLeft - walk;
        
        
        newScroll = Math.max(0, Math.min(newScroll, panoramaWidth - containerWidth));
        
        
        panorama.style.transform = `translateX(-${newScroll}px)`;
        currentScroll = newScroll;
        
        
        updateHotspotsPosition(newScroll);
    });
    
    
    panoramaContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - panoramaContainer.offsetLeft;
        scrollLeft = currentScroll;
        e.preventDefault();
    });
    
    panoramaContainer.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    panoramaContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - panoramaContainer.offsetLeft;
        const walk = (x - startX) * 3;
        
        
        let newScroll = scrollLeft - walk;
        
        
        newScroll = Math.max(0, Math.min(newScroll, panoramaWidth - containerWidth));
        
        
        panorama.style.transform = `translateX(-${newScroll}px)`;
        currentScroll = newScroll;
        
        
        updateHotspotsPosition(newScroll);
    });
    
    
    panoramaContainer.style.cursor = 'grab';
    
    
    panorama.style.minWidth = '200%'; 
    
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeInfoPanel();
        }
    });
    
    
    console.log('Tour Virtual 360 cargado correctamente');
    console.log('Haz clic en los puntos interactivos para explorar');
});

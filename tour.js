// Tour Virtual 360 - JavaScript COMPLETO
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const hotspots = document.querySelectorAll('.hotspot');
    const infoPanel = document.getElementById('infoPanel');
    const infoContent = document.getElementById('infoContent');
    const closeBtn = document.getElementById('closeBtn');
    const panoramaScroll = document.querySelector('.panorama-scroll');
    const panorama = document.getElementById('panorama');
    
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Variables para el control de arrastre
    let isDragging = false;
    let startX, scrollLeft;
    let animationFrame;

    // ==================== FUNCIONES PRINCIPALES ====================

    // Función para mostrar información
    function showInfo(targetId) {
        console.log('Mostrando información para:', targetId);
        const targetContent = document.getElementById(targetId);
        
        if (targetContent) {
            infoContent.innerHTML = targetContent.innerHTML;
            infoPanel.classList.add('active');
            overlay.classList.add('active');
            
            // Agregar eventos a los botones PDF
            const pdfButtons = infoContent.querySelectorAll('.pdf-btn');
            pdfButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const pdfUrl = this.getAttribute('data-pdf');
                    if (pdfUrl) {
                        window.open(pdfUrl, '_blank');
                    } else {
                        alert('Archivo PDF no disponible. Agrega el archivo correspondiente.');
                    }
                });
            });
            
            // Manejar errores de imágenes
            const images = infoContent.querySelectorAll('img');
            images.forEach(img => {
                img.onerror = function() {
                    this.style.display = 'none';
                };
            });
        } else {
            console.error('No se encontró el contenido para:', targetId);
        }
    }
    
    // Función para cerrar el panel de información
    function closeInfoPanel() {
        infoPanel.classList.remove('active');
        overlay.classList.remove('active');
    }

    // ==================== FUNCIONALIDAD 360° ARRASTRE ====================

    function startDrag(e) {
        isDragging = true;
        startX = getClientX(e) - panoramaScroll.offsetLeft;
        scrollLeft = panoramaScroll.scrollLeft;
        panoramaScroll.style.cursor = 'grabbing';
        
        // Prevenir comportamiento por defecto
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Iniciando arrastre');
    }
    
    function duringDrag(e) {
        if (!isDragging) return;
        
        // Cancelar animación frame anterior para mejor rendimiento
        cancelAnimationFrame(animationFrame);
        
        animationFrame = requestAnimationFrame(() => {
            const x = getClientX(e) - panoramaScroll.offsetLeft;
            const walk = (x - startX) * 2; // Velocidad de desplazamiento
            panoramaScroll.scrollLeft = scrollLeft - walk;
        });
        
        e.preventDefault();
        e.stopPropagation();
    }
    
    function stopDrag() {
        isDragging = false;
        panoramaScroll.style.cursor = 'grab';
        
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        
        console.log('Deteniendo arrastre');
    }
    
    // Función auxiliar para obtener coordenadas X (mouse/touch)
    function getClientX(e) {
        if (e.type.includes('touch')) {
            return e.touches[0].clientX;
        } else {
            return e.clientX;
        }
    }

    // ==================== EVENT LISTENERS ====================

    // Eventos de arrastre para MOUSE
    panoramaScroll.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', duringDrag);
    document.addEventListener('mouseup', stopDrag);
    
    // Eventos de arrastre para TÁCTIL
    panoramaScroll.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', duringDrag, { passive: false });
    document.addEventListener('touchend', stopDrag);
    
    // Prevenir arrastre accidental cuando el mouse sale del contenedor
    panoramaScroll.addEventListener('mouseleave', function() {
        if (isDragging) {
            stopDrag();
        }
    });

    // Eventos para los hotspots
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita que el clic active el arrastre
            const targetId = this.getAttribute('data-target');
            console.log('Hotspot clickeado:', targetId);
            showInfo(targetId);
        });
        
        // Efecto hover adicional
        hotspot.addEventListener('mouseenter', function() {
            this.style.zIndex = '20';
        });
        
        hotspot.addEventListener('mouseleave', function() {
            this.style.zIndex = '10';
        });
    });
    
    // Eventos para cerrar el panel
    closeBtn.addEventListener('click', closeInfoPanel);
    overlay.addEventListener('click', closeInfoPanel);
    
    // Cerrar panel con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && infoPanel.classList.contains('active')) {
            closeInfoPanel();
        }
    });

    // Prevenir que los clics en el panel cierren el mismo
    infoPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // ==================== INICIALIZACIÓN Y UTILIDADES ====================

    // Ajustar hotspots cuando se redimensiona la ventana
    function adjustHotspots() {
        console.log('Ajustando hotspots para tamaño de ventana');
        // Los hotspots se ajustan automáticamente por CSS
    }
    
    window.addEventListener('resize', adjustHotspots);
    
    // Verificar que la imagen 360 esté cargada
    panorama.onload = function() {
        console.log('Imagen 360° cargada correctamente');
        console.log('Dimensiones:', panorama.naturalWidth, 'x', panorama.naturalHeight);
        
        // Ajustar scroll inicial si es necesario
        panoramaScroll.scrollLeft = panoramaScroll.scrollWidth / 4;
    };
    
    panorama.onerror = function() {
        console.error('Error al cargar la imagen 360°');
        // Crear placeholder si la imagen no carga
        panorama.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        panorama.style.display = 'flex';
        panorama.style.alignItems = 'center';
        panorama.style.justifyContent = 'center';
        panorama.style.color = 'white';
        panorama.style.fontSize = '24px';
        panorama.style.textAlign = 'center';
        panorama.innerHTML = 'Imagen 360° no encontrada<br><small>Reemplaza assets/images/panorama-360.jpg</small>';
    };

    // ==================== INICIALIZACIÓN FINAL ====================

    // Mensajes de consola para debugging
    console.log('🎯 Tour Virtual 360 inicializado correctamente');
    console.log('📍 Hotspots encontrados:', hotspots.length);
    console.log('🖱️  Instrucciones:');
    console.log('   - Arrastra horizontalmente para girar la vista 360°');
    console.log('   - Haz clic en los puntos interactivos (hotspots)');
    console.log('   - Presiona ESC para cerrar los paneles de información');
    
    // Verificar que todos los elementos estén presentes
    if (!panorama) console.error('❌ No se encontró el elemento panorama');
    if (!panoramaScroll) console.error('❌ No se encontró el contenedor de scroll');
    if (!infoPanel) console.error('❌ No se encontró el panel de información');
    
    // Inicialización completa
    adjustHotspots();
});
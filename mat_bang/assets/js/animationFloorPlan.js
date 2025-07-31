import {
  createSvgT10_18WithActivePaths,
  createSvgT14WithActivePaths,
  createSvgT15_17WithActivePaths,
  createSvgT1WithActivePaths,
  createSvgT2WithActivePaths,
  createSvgT3WithActivePaths,
  createSvgT4WithActivePaths,
  createSvgT6_13WithActivePaths,
} from '../data/skyZenSvgAnimation.js';
import { floorPlanList } from './floorPlanList.js';

const emptyHouseImg = ['assets/images/house/house-empty.png'];

const houseImg = [
  {
    name: 'Officetel',
    img: [
      './assets/images/house/OFFICETEL_1.png',
      './assets/images/house/OFFICETEL_2.png',
    ],
    imgMobile: [
      './assets/images/house/OFFICETEL_1_mobile.png',
      './assets/images/house/OFFICETEL_2_mobile.png',
    ],
  },
  {
    name: 'studio',
    img: [
      './assets/images/house/STUDIO_1.png',
      './assets/images/house/STUDIO_2.png',
    ],
    imgMobile: [
      './assets/images/house/STUDIO_1_mobile.png',
      './assets/images/house/STUDIO_2_mobile.png',
    ],
  },
  {
    name: '2PN-1WC',
    img: [
      './assets/images/house/2PN-1WC_1.png',
      './assets/images/house/2PN-1WC_2.png',
    ],
    imgMobile: [
      './assets/images/house/2PN-1WC_1_mobile.png',
      './assets/images/house/2PN-1WC_2_mobile.png',
    ],
  },
  {
    name: '2PN-2WC',
    img: [
      './assets/images/house/2PN-2WC_1.png',
      './assets/images/house/2PN-2WC_2.png',
    ],
    imgMobile: [
      './assets/images/house/2PN-2WC_1_mobile.png',
      './assets/images/house/2PN-2WC_2_mobile.png',
    ],
  },
  {
    name: '3PN-2WC',
    img: [
      './assets/images/house/3PN-2WC_1.png',
      './assets/images/house/3PN-2WC_2.png',
    ],
    imgMobile: [
      './assets/images/house/3PN-2WC_1_mobile.png',
      './assets/images/house/3PN-2WC_2_mobile.png',
    ],
  },
];

// Helper functions
const setupSvgStyles = (svg) => {
  Object.assign(svg.style, {
    position: 'absolute',
    left: '0',
    maxWidth: '100%',
    height: '100%',
    zIndex: '3',
    pointerEvents: 'auto',
  });
};

const setupPathAnimation = (paths, translateY) => {
  paths.forEach((p) => {
    p.classList.add('svg-path-animated');
    p.style.transform = `translateY(${translateY})`;
    p.style.opacity = '0';
    p.style.cursor = 'pointer';
  });
};

const animatePaths = (paths) => {
  paths.forEach((p) => {
    p.style.transform = 'translateY(0)';
    p.style.opacity = '1';
  });
};

const saveOriginalAttributes = (path) => {
  const attrs = ['fill', 'fill-opacity', 'stroke', 'stroke-width'];
  attrs.forEach((attr) => {
    if (!path.hasAttribute(`data-orig-${attr}`)) {
      path.setAttribute(`data-orig-${attr}`, path.getAttribute(attr) || '');
    }
  });
};

const restoreOriginalAttributes = (path) => {
  const attrs = {
    stroke: 'black',
    'stroke-width': '1',
    fill: '',
    'fill-opacity': '0.5',
  };
  Object.entries(attrs).forEach(([attr, defaultValue]) => {
    path.setAttribute(
      attr,
      path.getAttribute(`data-orig-${attr}`) || defaultValue,
    );
  });
};

const createPopup = (container) => {
  let popup = container.querySelector('#popup-hover');
  if (!popup) {
    popup = document.createElement('div');
    Object.assign(popup.style, {
      display: 'none',
      position: 'absolute',
      zIndex: '999',
      background: '#fff',
      borderRadius: '8px',
      padding: '12px',
    });
    popup.id = 'popup-hover';
    container.appendChild(popup);
  }
  return popup;
};

const updatePopupPosition = (popup, e, container) => {
  const rect = container.getBoundingClientRect();
  // popup ở góc trên bên phải của path cho UI v1
  // popup.style.left = e.clientX - rect.left + 20 + 'px';
  // popup.style.top = e.clientY - rect.top - 20 + 'px';

  // popup ở góc trên bên phải của path cho UI v2
  const path = e.target;
  const pathRect = path.getBoundingClientRect();

  const left = pathRect.right - rect.left + 200;
  const top = pathRect.top - rect.top + 12;

  popup.style.left = left + 'px';
  popup.style.top = top + 'px';
  popup.style.transform = 'translateX(-100%)';
};

const renderModal = (data, hoverInfo, activePathIds = [], floor = '') => {
  console.log('🚀 ~ renderModal ~ data:', data);
  const houseImgUrl = houseImg.find(
    (h) =>
      h.name.toLocaleLowerCase() === data.type.toLowerCase() ||
      data.type.toLowerCase().includes(h.name.toLocaleLowerCase()),
  );
  const active = floorPlanList.find(
    (f, idx) => idx + 1 === window.currentActiveId,
  );

  window.renderModal({
    images:
      window.innerWidth < 768
        ? (houseImgUrl?.imgMobile || emptyHouseImg)
        : (houseImgUrl?.img || emptyHouseImg),
    name: data.type || 'Mặt bằng',
    area: data.ll || data.area || '',
    area_wall: data.tt || '',
    id: data.houseNumber || data.name || '1',
    svg_type: active.svg,
    activePathIds: activePathIds, // Sử dụng activePathIds từ path được click
    floor,
    room: data.name || '',
  });
};

// Helper function to detect mobile device
const isMobileDevice = () => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth < 768
  );
};

// Helper function to update popup position for touch events with boundary checking
const updatePopupPositionForTouch = (popup, e, container) => {
  const rect = container.getBoundingClientRect();

  // For mobile, position popup at left: 0, top: 10%
  const left = 0;
  const top = rect.height * 0.3; // 10% from top

  popup.style.left = left + 'px';
  popup.style.top = top + 'px';
};

const setupPathEventListeners = (path, container, hoverInfo) => {
  // Check if current floor is T3 or T4, if so, do nothing
  const floorKey = getFloorKey();
  if (floorKey === 'T3' || floorKey === 'T6') {
    // Remove pointer events for these paths
    path.style.pointerEvents = 'none';
    return;
  }

  const popup = createPopup(container);
  const isMobile = isMobileDevice();

  // Variables for mobile touch handling
  let touchStartTime = 0;
  let touchTimeout = null;
  let isPopupVisible = false;
  let touchCount = 0;
  let lastTouchTime = 0;

  // Desktop events
  if (!isMobile) {
    path.addEventListener('mouseenter', async (e) => {
      saveOriginalAttributes(path);
      path.classList.add('svg-path-hovered');

      const id = path.getAttribute('id');
      const data = hoverInfo[id] || {};

      updatePopupPosition(popup, e, container);

      const template = await fetch(
        './assets/templates/popup-hover-v2.html',
      ).then((res) => res.text());
      const processedTemplate = template
        .replace(
          /\{\{icon\}\}/g,
          data.icon || './assets/images/icons/skyzen_icon.webp',
        )
        .replace(/\{\{type\}\}/g, data.type || '')
        .replace(/\{\{name\}\}/g, data.name || '')
        .replace(/\{\{ll\}\}/g, data.ll || data.area || '')
        .replace(/\{\{tt\}\}/g, data.tt || '')
        .replace(/\{\{button\}\}/g, data.button || 'Xem chi tiết');

      popup.innerHTML = processedTemplate;
      Object.assign(popup.style, {
        display: 'block',
        background: 'transparent',
        padding: '0',
      });

      const popupContent = popup.querySelector('.popup-hover-content');
      if (popupContent) {
        popupContent.classList.remove('active');
        setTimeout(() => popupContent.classList.add('active'), 10);
      }
    });

    path.addEventListener('mousemove', (e) =>
      updatePopupPosition(popup, e, container),
    );

    path.addEventListener('mouseleave', () => {
      path.classList.remove('svg-path-hovered');
      restoreOriginalAttributes(path);
      popup.style.display = 'none';
      const popupContent = popup.querySelector('.popup-hover-content');
      if (popupContent) popupContent.classList.remove('active');
    });

    path.addEventListener('click', () => {
      const id = path.getAttribute('id');
      const data = hoverInfo[id] || {};
      const floor = document.querySelector('.legend-title');

      const overlay = document.querySelector('.floor-plan-overlay');
      overlay.classList.toggle('active');

      // Lấy activePathIds dựa trên màu của path được click
      const activePathIds = getActivePathIdsFromClickedPath(path);

      renderModal(data, hoverInfo, activePathIds, floor.innerHTML);
    });
  } else {
    // Mobile touch events - chỉ thay đổi flow từ double touch sang click button
    path.addEventListener('touchstart', async (e) => {
      e.preventDefault();
      const currentTime = Date.now();

      // Reset touch count if too much time has passed
      if (currentTime - lastTouchTime > 500) {
        touchCount = 0;
      }

      touchCount++;
      lastTouchTime = currentTime;
      touchStartTime = currentTime;

      // Single touch - show popup immediately
      if (touchCount === 1) {
        saveOriginalAttributes(path);
        path.classList.add('svg-path-hovered');

        const id = path.getAttribute('id');
        const data = hoverInfo[id] || {};

        updatePopupPositionForTouch(popup, e, container);

        const template = await fetch(
          './assets/templates/popup-hover-v2.html',
        ).then((res) => res.text());
        const processedTemplate = template
          .replace(
            /\{\{icon\}\}/g,
            data.icon || './assets/images/icons/skyzen_icon.webp',
          )
          .replace(/\{\{type\}\}/g, data.type || '')
          .replace(/\{\{name\}\}/g, data.name || '')
          .replace(/\{\{ll\}\}/g, data.ll || data.area || '')
          .replace(/\{\{tt\}\}/g, data.tt || '')
          .replace(/\{\{button\}\}/g, data.button || 'Xem chi tiết');

        popup.innerHTML = processedTemplate;
        Object.assign(popup.style, {
          display: 'block',
          background: 'transparent',
          padding: '0',
          top: '0px',
        });

        const popupContent = popup.querySelector('.popup-hover-content');
        if (popupContent) {
          popupContent.classList.remove('active');
          setTimeout(() => popupContent.classList.add('active'), 10);
        }

        isPopupVisible = true;

        // Add click event listener to the button after popup is created
        setTimeout(() => {
          const button = popup.querySelector('.popup-hover-btn');
          if (button) {
            // Remove existing event listeners to prevent duplicates
            button.replaceWith(button.cloneNode(true));
            const newButton = popup.querySelector('.popup-hover-btn');

            newButton.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();

              const id = path.getAttribute('id');
              const data = hoverInfo[id] || {};
              const floor = document.querySelector('.legend-title');

              // Lấy activePathIds dựa trên màu của path được click
              const activePathIds = getActivePathIdsFromClickedPath(path);
              console.log('Active Path IDs from clicked path:', activePathIds);

              renderModal(data, hoverInfo, activePathIds, floor.innerHTML);

              // Hide popup after opening modal
              path.classList.remove('svg-path-hovered');
              restoreOriginalAttributes(path);
              popup.style.display = 'none';
              const popupContent = popup.querySelector('.popup-hover-content');
              if (popupContent) popupContent.classList.remove('active');
            });
          }
        }, 50);
      }
    });

    path.addEventListener('touchend', (e) => {
      e.preventDefault();
      const touchDuration = Date.now() - touchStartTime;

      // Chỉ reset touch count, không còn double touch logic
      if (touchCount === 1) {
        touchTimeout = setTimeout(() => {
          touchCount = 0;
        }, 300);
      }
    });

    path.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (isPopupVisible) {
        updatePopupPositionForTouch(popup, e, container);
      }
    });

    // Hide popup when touching elsewhere
    document.addEventListener(
      'touchstart',
      (e) => {
        if (
          isPopupVisible &&
          !path.contains(e.target) &&
          !popup.contains(e.target)
        ) {
          path.classList.remove('svg-path-hovered');
          restoreOriginalAttributes(path);
          popup.style.display = 'none';
          const popupContent = popup.querySelector('.popup-hover-content');
          if (popupContent) popupContent.classList.remove('active');
          isPopupVisible = false;
          touchCount = 0; // Reset touch count
        }
      },
      { passive: true },
    );
  }
};

const getFloorKey = () => {
  try {
    const active = floorPlanList.find(
      (f, idx) => idx + 1 === window.currentActiveId,
    );
    return active?.svg?.match(/^T\d+\.svg$/)
      ? active.svg.replace('.svg', '')
      : 'T1';
  } catch (e) {
    return 'T1';
  }
};

// Helper function để tạo SVG với active paths và thêm text
export const createSvgWithActivePaths = (
  svgTemplate,
  activePathIds = [],
  houseNumber = '',
) => {
  // Parse SVG template
  const temp = document.createElement('div');
  temp.innerHTML = svgTemplate;
  const svg = temp.firstElementChild;

  // Update paths based on active state
  const paths = svg.querySelectorAll('path');
  paths.forEach((path) => {
    const pathId = path.getAttribute('id');
    const isActive = activePathIds.includes(pathId);

    if (isActive) {
      // Giữ nguyên màu gốc cho active paths
      // Không thay đổi màu
    } else {
      // Đổi thành màu xám cho inactive paths
      path.setAttribute('fill', '#D3D3D3'); // Light gray
      path.setAttribute('stroke', '#A9A9A9'); // Darker gray
      path.setAttribute('fill-opacity', '0.3');
    }
  });

  // Thêm text với số thứ tự vào các path active
  if (activePathIds.length > 0) {
    activePathIds.forEach((pathId, index) => {
      const path = svg.querySelector(`path[id="${pathId}"]`);
      if (path) {
        // Lấy bounding box của path để tính toán vị trí và kích thước
        const bbox = path.getBBox();
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;

        // Tính toán font size = 30% của kích thước nhỏ nhất của path
        const minDimension = Math.min(bbox.width, bbox.height);
        const fontSize = Math.max(minDimension * 0.3, 12); // Tối thiểu 12px

        // Tạo text element với số thứ tự (index + 1)
        const text = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'text',
        );
        text.setAttribute('x', centerX);
        text.setAttribute('y', centerY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', '#FF0000'); // Màu đỏ
        text.setAttribute('font-size', Math.round(fontSize));
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('pointer-events', 'none'); // Không cho phép click vào text
        text.textContent = (index + 1).toString(); // Số thứ tự: 1, 2, 3, ...

        // Thêm text vào SVG
        svg.appendChild(text);
      }
    });
  }

  return svg.outerHTML;
};

export function animationFloorPlan(
  container,
  svgMarkup,
  activePathIds = [],
  disableEvents = false,
) {
  if (!svgMarkup) return;

  // Remove old SVG and create new one
  container.querySelector('.animation-floorplan-svg')?.remove();

  let processedSvgMarkup = svgMarkup;

  // Nếu có activePathIds, xử lý SVG với active paths
  if (activePathIds && activePathIds.length > 0) {
    // Xác định loại SVG và tạo với active paths
    if (svgMarkup.includes('T1-')) {
      processedSvgMarkup = createSvgT1WithActivePaths(activePathIds);
    } else if (svgMarkup.includes('T2-')) {
      processedSvgMarkup = createSvgT2WithActivePaths(activePathIds);
    } else if (svgMarkup.includes('T3-')) {
      processedSvgMarkup = createSvgT3WithActivePaths(activePathIds);
    } else if (svgMarkup.includes('T4-')) {
      processedSvgMarkup = createSvgT4WithActivePaths(activePathIds);
    } else if (
      svgMarkup.includes('T6-') ||
      svgMarkup.includes('T7-') ||
      svgMarkup.includes('T8-') ||
      svgMarkup.includes('T9-') ||
      svgMarkup.includes('T10-') ||
      svgMarkup.includes('T11-') ||
      svgMarkup.includes('T12-') ||
      svgMarkup.includes('T13-')
    ) {
      processedSvgMarkup = createSvgT6_13WithActivePaths(activePathIds);
    } else if (svgMarkup.includes('T14-')) {
      processedSvgMarkup = createSvgT14WithActivePaths(activePathIds);
    } else if (
      svgMarkup.includes('T15-') ||
      svgMarkup.includes('T16-') ||
      svgMarkup.includes('T17-')
    ) {
      processedSvgMarkup = createSvgT15_17WithActivePaths(activePathIds);
    } else if (svgMarkup.includes('T18-')) {
      processedSvgMarkup = createSvgT10_18WithActivePaths(activePathIds);
    }
  }

  const temp = document.createElement('div');
  temp.innerHTML = processedSvgMarkup;
  const svg = temp.firstElementChild;
  setupSvgStyles(svg);

  // Nếu disableEvents = true, tắt pointer events
  if (disableEvents) {
    svg.style.pointerEvents = 'none';
  }

  container.appendChild(svg);

  // Setup path groups
  const paths = Array.from(svg.querySelectorAll('path'));
  const upGroup = paths.filter((p) => p.getAttribute('data-group') === 'up');
  const downGroup = paths.filter(
    (p) => p.getAttribute('data-group') === 'down',
  );

  // Setup initial animation
  setupPathAnimation(upGroup, '-100px');
  setupPathAnimation(downGroup, '100px');

  // Animate paths
  setTimeout(() => animatePaths([...upGroup, ...downGroup]), 30);

  // Chỉ setup event listeners nếu không disable events
  if (!disableEvents) {
    // Load data and setup event listeners
    Promise.all([
      fetch('./assets/data/svg.json')
        .then((res) => res.json())
        .catch(() => []),
      fetch('./assets/data/svgHover.json')
        .then((res) => res.json())
        .catch(() => ({})),
    ])
      .then(([, svgHover]) => {
        const floorKey = getFloorKey();
        const hoverInfo = svgHover[floorKey] || [];

        // Setup event listeners for all paths
        [...upGroup, ...downGroup].forEach((path) => {
          setupPathEventListeners(path, container, hoverInfo);
        });

        // Ensure popup exists
        createPopup(container);
      })
      .catch((error) => {
        console.error('Error loading JSON data:', error);
        createPopup(container);
      });
  }
}

// Hàm để lấy activePathIds dựa trên màu của path được click
export function getActivePathIdsFromClickedPath(clickedPath) {
  const activePathIds = [];

  if (!clickedPath) {
    console.warn('Clicked path not found');
    return activePathIds;
  }

  // Lấy màu của path được click
  const clickedFill = clickedPath.getAttribute('fill');
  const clickedStroke = clickedPath.getAttribute('stroke');

  console.log('Clicked path colors:', {
    fill: clickedFill,
    stroke: clickedStroke,
  });

  // Tìm tất cả paths có cùng màu với path được click
  const svgElement = clickedPath.closest('svg');
  const allPaths = svgElement.querySelectorAll('path');

  allPaths.forEach((path) => {
    const fill = path.getAttribute('fill');
    const stroke = path.getAttribute('stroke');

    // So sánh màu với path được click
    if (fill === clickedFill && stroke === clickedStroke) {
      const pathId = path.getAttribute('id');
      if (pathId) {
        activePathIds.push(pathId);
      }
    }
  });

  return activePathIds;
}

// Hàm tiện ích để lấy active paths từ container hiện tại
export function getCurrentActivePathIds(container) {
  const svgElement = container.querySelector('.animation-floorplan-svg');
  const paths = svgElement.querySelectorAll('path');

  // Tìm path có màu gốc (không phải màu xám inactive)
  const inactiveColors = {
    fill: '#D3D3D3',
    stroke: '#A9A9A9',
    fillOpacity: '0.3',
  };

  for (let path of paths) {
    const fill = path.getAttribute('fill');
    const stroke = path.getAttribute('stroke');
    const fillOpacity = path.getAttribute('fill-opacity');

    // Nếu path này có màu gốc (không phải inactive)
    const isInactive =
      fill === inactiveColors.fill &&
      stroke === inactiveColors.stroke &&
      fillOpacity === inactiveColors.fillOpacity;

    if (!isInactive) {
      // Lấy màu của path này và tìm tất cả paths cùng màu
      return getActivePathIdsFromClickedPath(path);
    }
  }

  return [];
}

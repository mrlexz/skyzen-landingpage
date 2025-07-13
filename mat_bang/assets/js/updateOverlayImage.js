import { floorPlanList } from './floorPlanList.js';
import { animationFloorPlan } from './animationFloorPlan.js';
import {
  SVG_ANIMATION_SKYZEN_T1,
  SVG_ANIMATION_SKYZEN_T10_18,
  SVG_ANIMATION_SKYZEN_T14,
  SVG_ANIMATION_SKYZEN_T15_17,
  SVG_ANIMATION_SKYZEN_T2,
  SVG_ANIMATION_SKYZEN_T3,
  SVG_ANIMATION_SKYZEN_T4,
  SVG_ANIMATION_SKYZEN_T6_13,
} from '../data/skyZenSvgAnimation.js';

// Mapping để rút gọn logic
const floorPlanConfig = {
  'T1.svg': {
    image: './assets/images/FloorPlan/T1.png',
    alt: 'T1 background',
    animation: SVG_ANIMATION_SKYZEN_T1,
    hasPopup: true,
  },
  'T2.svg': {
    image: './assets/images/FloorPlan/T2.png',
    alt: 'T2 background',
    animation: SVG_ANIMATION_SKYZEN_T2,
  },
  'T3.svg': {
    image: './assets/images/FloorPlan/T3.png',
    alt: 'T3 background',
    animation: SVG_ANIMATION_SKYZEN_T3,
  },
  'T6.svg': {
    image: './assets/images/FloorPlan/T4.png',
    alt: 'T4 background',
    animation: SVG_ANIMATION_SKYZEN_T4,
  },
  'T79.svg': {
    image: './assets/images/FloorPlan/T6-13.png',
    alt: 'T6-13 background',
    animation: SVG_ANIMATION_SKYZEN_T6_13,
  },
  'T1020.svg': {
    image: './assets/images/FloorPlan/T14.png',
    alt: 'T14 background',
    animation: SVG_ANIMATION_SKYZEN_T14,
  },
  'T2240.svg': {
    image: './assets/images/FloorPlan/T15~17.png',
    alt: 'T15~17 background',
    animation: SVG_ANIMATION_SKYZEN_T15_17,
  },
  'T18.svg': {
    image: './assets/images/FloorPlan/T18.png',
    alt: 'T18 background',
    animation: SVG_ANIMATION_SKYZEN_T10_18,
  },
};

// Helper function để tạo SVG với active paths
export const createSvgWithActivePaths = (svgTemplate, activePathIds = []) => {
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
      // Không thay đổi gì
    } else {
      // Đổi thành màu xám cho inactive paths
      path.setAttribute('fill', '#D3D3D3'); // Light gray
      path.setAttribute('stroke', '#A9A9A9'); // Darker gray
      path.setAttribute('fill-opacity', '0.3');
    }
  });

  return svg.outerHTML;
};

// Function để tạo SVG T2 với active paths
export const createSvgT2WithActivePaths = (activePathIds = []) => {
  return createSvgWithActivePaths(SVG_ANIMATION_SKYZEN_T2, activePathIds);
};

// Function để tạo SVG T1 với active paths
export const createSvgT1WithActivePaths = (activePathIds = []) => {
  return createSvgWithActivePaths(SVG_ANIMATION_SKYZEN_T1, activePathIds);
};

// Function để tạo SVG T3 với active paths
export const createSvgT3WithActivePaths = (activePathIds = []) => {
  return createSvgWithActivePaths(SVG_ANIMATION_SKYZEN_T3, activePathIds);
};

// Function để tạo SVG T4 với active paths
export const createSvgT4WithActivePaths = (activePathIds = []) => {
  return createSvgWithActivePaths(SVG_ANIMATION_SKYZEN_T4, activePathIds);
};

// Function để tạo SVG T6-13 với active paths
export const createSvgT6_13WithActivePaths = (activePathIds = []) => {
  return createSvgWithActivePaths(SVG_ANIMATION_SKYZEN_T6_13, activePathIds);
};

// Function để tạo SVG T14 với active paths
export const createSvgT14WithActivePaths = (activePathIds = []) => {
  return createSvgWithActivePaths(SVG_ANIMATION_SKYZEN_T14, activePathIds);
};

// Function để tạo SVG T15-17 với active paths
export const createSvgT15_17WithActivePaths = (activePathIds = []) => {
  return createSvgWithActivePaths(SVG_ANIMATION_SKYZEN_T15_17, activePathIds);
};

// Function để tạo SVG T10-18 với active paths
export const createSvgT10_18WithActivePaths = (activePathIds = []) => {
  return createSvgWithActivePaths(SVG_ANIMATION_SKYZEN_T10_18, activePathIds);
};

export const updateOverlayImage = async (activePathIds = []) => {
  const wrapper = document.querySelector('.floor-plan-bg-wrapper');
  if (!wrapper) return;

  if (getComputedStyle(wrapper).position === 'static') {
    wrapper.style.position = 'relative';
  }

  let svgContainer = document.getElementById('svg-container');
  if (!svgContainer) return;

  const active = floorPlanList.find(
    (f, idx) => idx + 1 === window.currentActiveId,
  );

  if (!active) {
    svgContainer.innerHTML = '';
    svgContainer.style.display = 'none';
    return;
  }

  const config = floorPlanConfig[active.svg];

  if (config) {
    // Xử lý floor plan có animation
    svgContainer.style.display = 'flex';
    svgContainer.innerHTML = '';

    const bgImg = document.createElement('img');
    bgImg.src = config.image;
    bgImg.alt = config.alt;
    bgImg.className = 'svg-bg-img';
    svgContainer.appendChild(bgImg);

    // Thêm popup cho T1
    if (config.hasPopup) {
      let popupDiv = document.createElement('div');
      popupDiv.id = 'popup-hover';
      popupDiv.className = 'popup-hover';
      svgContainer.appendChild(popupDiv);
    }

    // Truyền activePathIds vào animationFloorPlan
    animationFloorPlan(svgContainer, config.animation, activePathIds);
  } else {
    // Xử lý floor plan thông thường
    svgContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = `./assets/images/${active.svg}`;
    img.alt = active.name;
    img.className = 'svg-bg-img';
    svgContainer.appendChild(img);
    svgContainer.style.display = 'flex';
  }
};

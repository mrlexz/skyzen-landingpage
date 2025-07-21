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
import { animationFloorPlan } from './animationFloorPlan.js';
import { floorPlanList } from './floorPlanList.js';
import { updateOverlayImage } from './updateOverlayImage.js';

// Thêm floorPlanConfig từ updateOverlayImage.js
const floorPlanConfig = {
  'T1.svg': {
    image: './assets/images/FloorPlan/T1.png',
    imageMobile: './assets/images/FloorPlan/T1_mobile.png',
    alt: 'T1 background',
    animation: SVG_ANIMATION_SKYZEN_T1,
    hasPopup: true,
  },
  'T2.svg': {
    image: './assets/images/FloorPlan/T2.png',
    imageMobile: './assets/images/FloorPlan/T2_mobile.png',
    alt: 'T2 background',
    animation: SVG_ANIMATION_SKYZEN_T2,
  },
  'T3.svg': {
    image: './assets/images/FloorPlan/T3.png',
    imageMobile: './assets/images/FloorPlan/T3_mobile.png',
    alt: 'T3 background',
    animation: SVG_ANIMATION_SKYZEN_T3,
  },
  'T6.svg': {
    image: './assets/images/FloorPlan/T4.png',
    imageMobile: './assets/images/FloorPlan/T4_mobile.png',
    alt: 'T4 background',
    animation: SVG_ANIMATION_SKYZEN_T4,
  },
  'T79.svg': {
    image: './assets/images/FloorPlan/T6-13.png',
    imageMobile: './assets/images/FloorPlan/T6-13_mobile.png',
    alt: 'T6-13 background',
    animation: SVG_ANIMATION_SKYZEN_T6_13,
  },
  'T1020.svg': {
    image: './assets/images/FloorPlan/T14.png',
    imageMobile: './assets/images/FloorPlan/T14_mobile.png',
    alt: 'T14 background',
    animation: SVG_ANIMATION_SKYZEN_T14,
  },
  'T2240.svg': {
    image: './assets/images/FloorPlan/T15~17.png',
    imageMobile: './assets/images/FloorPlan/T15~17_mobile.png',
    alt: 'T15~17 background',
    animation: SVG_ANIMATION_SKYZEN_T15_17,
  },
  'T18.svg': {
    image: './assets/images/FloorPlan/T18.png',
    imageMobile: './assets/images/FloorPlan/T18_mobile.png',
    alt: 'T18 background',
    animation: SVG_ANIMATION_SKYZEN_T10_18,
  },
};

window.currentActiveId = 1;

window.handleClickActive = (id) => {
  window.currentActiveId = id;
  const floorPlanListEl = document.querySelectorAll('.floor-plan-item');
  floorPlanListEl.forEach((item) => {
    item.dataset.id === id.toString() && item.classList.add('active');
    item.dataset.id !== id.toString() && item.classList.remove('active');
  });
  updateOverlayImage();
  renderLegend();

  // Đóng menu trên mobile sau khi chọn
  if (window.innerWidth <= 1024) {
    window.closeFloorPlanList();
  }
};

const renderLegend = () => {
  let legendEl = document.querySelector('.floor-plan-legend');

  if (!legendEl) {
    legendEl = document.createElement('div');
    legendEl.className = 'floor-plan-legend v2';
    document.querySelector('.floor-plan-bg-wrapper').appendChild(legendEl);
  }
  const active = floorPlanList.find(
    (f, idx) => idx + 1 === window.currentActiveId,
  );

  if (!active) {
    return;
  }
  legendEl.innerHTML = `
    <div class="legend-list">
      ${active.legend
        .map(
          (item) =>
            `<div><span style="background:${item.color}"></span>${item.label}</div>`,
        )
        .join('')}
       <div><span>NFA</span>Diện tích tim tường</div>
        <div><span>NSA</span>Diện tích thông thuỷ</div>
    </div>
    <div class="legend-title">
      <div class="legend-title-item">Mặt bằng</div>
      <div class="legend-title-text legend-title-item">${active.title}</div>
    </div>
  `;

  console.log(legendEl.offsetHeight);

  const mainImg = document.querySelector('.floor-plan-main-img');
  if (window.innerWidth <= 1024) {
    mainImg.style.top = `${legendEl.offsetHeight + 65}px`;
    window.updateSvgContainerPosition();
  }
  window.updateSvgContainerPosition();

  // Animation slide right từng element con
  const legendTitleItems = legendEl.querySelectorAll('.legend-title-item');
  legendTitleItems.forEach((el, idx) => {
    el.classList.remove('slide-in');
    setTimeout(() => {
      el.classList.add('slide-in');
    }, idx * 500);
  });
};

window.renderModal = ({
  images = [],
  name = '',
  area = '',
  area_wall = '',
  id = '',
  sub_img = '',
  svg_type = '', // Thêm parameter để xác định loại SVG
  activePathIds = [], // Thêm parameter để truyền active paths
  externalId = '', // Thêm parameter để hiển thị ID từ bên ngoài
  floor,
  room,
}) => {
  const modal = document.getElementById('floor-plan-modal');
  modal.classList.remove('hidden');
  const detail = modal.querySelector('.floor-plan-modal-content-detail');
  const carousel = modal.querySelector(
    '.floor-plan-modal-content-carousel .carousel',
  );
  const subImg = modal.querySelector('.floor-plan-modal-content-sub_img');

  detail.innerHTML = `
            <h2>Căn hộ ${name}</h2>
            <h2 class="room-name">${room}</h2>
            <hr />
            <div class="apartment-info">
              <div>Mã căn: <span>${room}</span></div>
              ${
                externalId
                  ? `<div>ID bên ngoài: <span>${externalId}</span></div>`
                  : ''
              }
              <div>Diện tích tim tường: <span>${area} m²</span></div>
              <div>Diện tích thông thuỷ: <span>${area_wall} m²</span></div>
            </div>
            <button class="floor-plan-modal-btn" onclick="closeModal()">Quay lại →</button>
  `;

  carousel.innerHTML = images
    .map(
      (image) => `<img
                src="${image}"
                alt="floor-plan-modal-carousel-item"
              />`,
    )
    .join('');

  // Cập nhật để hiển thị layout SVG với active paths
  if (svg_type) {
    const config = floorPlanConfig[svg_type];
    if (config) {
      subImg.innerHTML = `
        <div class="modal-svg-container" style="position: relative; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
          <img
            src="${window.innerWidth < 768 ? config.imageMobile : config.image}"
            alt="${config.alt}"
            style="max-width: 100%; height: auto; object-fit: contain; "
          />
          <div class="modal-svg-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
            <!-- SVG animation sẽ được render ở đây -->
          </div>
        </div>
      `;

      // Render SVG animation với active paths và tắt events
      const overlayContainer = subImg.querySelector('.modal-svg-overlay');
      if (overlayContainer) {
        animationFloorPlan(
          overlayContainer,
          config.animation,
          activePathIds,
          true, // Thêm parameter để tắt events
          '', // Không cần truyền houseNumber nữa vì sẽ dùng số thứ tự
        );
      }
    } else {
      // Fallback cho SVG thông thường
      subImg.innerHTML = `
        <div class="modal-svg-container" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
          <img
            src="./assets/images/${svg_type}"
            alt="${name}"
            style="max-width: 100%; height: auto; object-fit: contain;"
          />
        </div>
      `;
    }
  } else if (sub_img) {
    // Fallback cho hình ảnh thông thường
    subImg.innerHTML = `
      <div class="modal-svg-container" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
        <img
          src="${sub_img}"
          alt="floor-plan-modal-sub-img"
          style="max-width: 100%; height: auto; object-fit: contain;"
        />
      </div>
    `;
  } else {
    subImg.innerHTML = '';
  }

  setTimeout(() => {
    $('.carousel').slick({
      arrows: true,
      prevArrow: $('.btn-carousel:first-child'),
      nextArrow: $('.btn-carousel:last-child'),
    });
  }, 100);
};

window.closeModal = () => {
  const modal = document.getElementById('floor-plan-modal');
  modal.classList.add('hidden');
  $('.carousel').slick('unslick');
  const overlay = document.querySelector('.floor-plan-overlay');
  overlay.classList.remove('active');
};

const renderLayout = () => {
  const root = document.getElementById('floor-plan');
  const wrapper = document.createElement('div');
  wrapper.className = 'floor-plan-bg-wrapper';

  const bg = document.createElement('img');
  bg.src = './assets/images/FloorPlan/bg_layout.webp';
  bg.alt = 'Background';
  bg.className = 'floor-plan-bg-img';
  // wrapper.appendChild(bg);

  const mainImg = document.createElement('img');
  mainImg.src = './assets/images/FloorPlan/bg_layout.webp';
  mainImg.alt = 'Floor Map';
  mainImg.className = 'floor-plan-main-img';
  wrapper.appendChild(mainImg);

  let svgContainer = document.createElement('div');
  svgContainer.id = 'svg-container';

  // Cập nhật để svg-container luôn căn giữa mainImg
  window.updateSvgContainerPosition = () => {
    const mainImgRect = mainImg.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const isMobile = window.innerWidth <= 1024;

    // Tính toán vị trí tương đối của mainImg trong wrapper
    const mainImgLeft = mainImgRect.left - wrapperRect.left;
    const mainImgTop = mainImgRect.top - wrapperRect.top;
    const mainImgWidth = mainImgRect.width;
    const mainImgHeight = mainImgRect.height;

    // Đặt svg-container có cùng kích thước và vị trí với mainImg
    svgContainer.style.width = `${mainImgWidth}px`;
    svgContainer.style.height = `${mainImgHeight}px`;
    svgContainer.style.position = 'absolute';
    svgContainer.style.left = `${mainImgLeft}px`;
    svgContainer.style.top = `${mainImgTop}px `;
    svgContainer.style.transform = 'none '; // Bỏ transform vì đã dùng left/top

    console.log(
      `SVG container positioned at: ${mainImgLeft}px, ${mainImgTop}px, size: ${mainImgWidth}x${mainImgHeight}, mobile: ${isMobile}`,
    );
  };

  // Cập nhật vị trí khi mainImg load xong
  mainImg.onload = window.updateSvgContainerPosition;

  // Cập nhật vị trí khi window resize
  window.addEventListener('resize', window.updateSvgContainerPosition);

  wrapper.appendChild(svgContainer);

  root.appendChild(wrapper);

  // Thêm hamburger button
  const hamburgerButton = document.createElement('button');
  hamburgerButton.className = 'hamburger-button';
  hamburgerButton.innerHTML = `
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  `;
  hamburgerButton.addEventListener('click', toggleFloorPlanList);
  root.appendChild(hamburgerButton);

  // Thêm overlay
  const overlay = document.createElement('div');
  overlay.className = 'floor-plan-overlay';
  overlay.addEventListener('click', closeFloorPlanList);
  root.appendChild(overlay);

  const floorPlanListEl = document.createElement('div');
  floorPlanListEl.classList.add('floor-plan-list', 'v2');
  floorPlanListEl.style.marginTop = '30px'; // Thêm margin-top cho floor-plan-list.v2

  const floorList = `
    ${floorPlanList
      .map((item, idx) => {
        return `<div class="floor-plan-item v2${
          idx === 0 ? ' active' : ''
        }" data-id="${idx + 1}" onclick="handleClickActive(${idx + 1})">
        <div class="floor-plan-item-name">${item.name}</div>
      </div>`;
      })
      .join('')}
  `;
  floorPlanListEl.innerHTML = floorList;
  updateOverlayImage();
  renderLegend();

  // Thêm floorPlanListEl ngay sau mainImg
  mainImg.insertAdjacentElement('afterend', floorPlanListEl);

  // Đảm bảo floor-plan-list.v2 nằm sau floor-plan-legend.v2
  const legendEl = wrapper.querySelector('.floor-plan-legend.v2');
  if (legendEl) {
    // Nếu legendEl tồn tại, chèn floorPlanListEl sau legendEl
    legendEl.insertAdjacentElement('afterend', floorPlanListEl);
  } else {
    // Nếu không có legend, append như bình thường
    wrapper.appendChild(floorPlanListEl);
  }
  return;
};

// Thêm các hàm mới cho hamburger menu
window.toggleFloorPlanList = () => {
  const floorPlanList = document.querySelector('.floor-plan-list');
  const hamburgerButton = document.querySelector('.hamburger-button');
  const overlay = document.querySelector('.floor-plan-overlay');

  if (window.innerWidth <= 1024) {
    floorPlanList.classList.toggle('active');
    hamburgerButton.classList.toggle('active');
    overlay.classList.toggle('active');
  }
};

window.closeFloorPlanList = () => {
  const floorPlanList = document.querySelector('.floor-plan-list');
  const hamburgerButton = document.querySelector('.hamburger-button');
  const overlay = document.querySelector('.floor-plan-overlay');

  if (window.innerWidth <= 1024) {
    floorPlanList.classList.remove('active');
    hamburgerButton.classList.remove('active');
    overlay.classList.remove('active');
  }
};

document.addEventListener('DOMContentLoaded', function () {
  renderLayout();
});

$(document).ready(function () {});

// Hàm để lấy activePathIds từ màu sắc của SVG
export function getActivePathIdsFromColors(svgElement) {
  const activePathIds = [];

  if (!svgElement) {
    console.warn('SVG element not found');
    return activePathIds;
  }

  const paths = svgElement.querySelectorAll('path');

  // Màu sắc của inactive paths (được set trong createSvgWithActivePaths)
  const inactiveColors = {
    fill: '#D3D3D3',
    stroke: '#A9A9A9',
    fillOpacity: '0.3',
  };

  paths.forEach((path) => {
    const fill = path.getAttribute('fill');
    const stroke = path.getAttribute('stroke');
    const fillOpacity = path.getAttribute('fill-opacity');

    // Kiểm tra xem path có phải inactive không
    const isInactive =
      fill === inactiveColors.fill &&
      stroke === inactiveColors.stroke &&
      fillOpacity === inactiveColors.fillOpacity;

    // Nếu không phải inactive thì là active
    if (!isInactive) {
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
  return getActivePathIdsFromColors(svgElement);
}

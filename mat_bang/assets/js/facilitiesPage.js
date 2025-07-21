let currentFloorIndex = 0;
let prevContent = null;
let prevIdx = null;

function renderFacilitiesList(floorIndex) {
  const list = document.getElementById('facilities-list');
  if (!list) return;
  list.innerHTML = '';
  const facilities = window.facilitiesFloors[floorIndex].facilities;
  facilities.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'flex items-start gap-2';
    li.innerHTML = `
      <span class="flex justify-center items-center w-6 h-6 rounded-full border border-white text-white text-[10px] font-semibold${
        isNaN(item.label) ? ' lowercase' : ''
      }">
        ${item.label}
      </span>
      ${item.name}
    `;
    list.appendChild(li);
  });
}

function renderFacilitiesNumbers(floorIndex) {
  const container = document.getElementById('facilities-numbers-container');
  if (!container) return;
  container.innerHTML = '';

  // Lấy phần tử ảnh nền
  const img = document.querySelector('.bg_img');
  if (!img) return;
  const width = img.offsetWidth;
  const height = img.offsetHeight;

  const numbers = window.facilitiesFloors[floorIndex].numbers;
  numbers.forEach((item) => {
    const div = document.createElement('div');

    div.className =
      'map_item absolute w-8 h-8 max-lg:w-4 max-lg:h-4 rounded-full  bg-[#d09e6b] text-[12px] max-lg:text-[8px] font-semibold flex items-center justify-center select-none' +
      (isNaN(item.label) ? ' lowercase' : ' text-white');
    // Tính toán vị trí dựa trên width, height thực tế
    const topRatio =
      typeof item.top === 'string' && item.top.includes('%')
        ? parseFloat(item.top) / 100
        : item.top;
    const leftRatio =
      typeof item.left === 'string' && item.left.includes('%')
        ? parseFloat(item.left) / 100
        : item.left;
    div.style.top = height * topRatio + 'px';
    div.style.left = width * leftRatio + 'px';
    div.textContent = item.label;
    container.appendChild(div);
  });
}

function animateCollapseOpen(element) {
  element.style.display = 'block';
  element.style.overflow = 'hidden';
  element.style.maxHeight = '0px';
  element.style.opacity = '0';
  setTimeout(() => {
    element.style.transition =
      'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s';
    element.style.maxHeight = '400px';
    element.style.opacity = '1';
  }, 10);
  element.addEventListener('transitionend', function handler(e) {
    if (e.propertyName === 'max-height') {
      element.style.maxHeight = 'none';
      element.style.overflow = '';
      element.removeEventListener('transitionend', handler);
    }
  });
}

function animateCollapseClose(element) {
  element.style.overflow = 'hidden';
  element.style.maxHeight = element.scrollHeight + 'px';
  element.style.opacity = '1';
  setTimeout(() => {
    element.style.transition =
      'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s';
    element.style.maxHeight = '0px';
    element.style.opacity = '0';
  }, 10);
  element.addEventListener('transitionend', function handler(e) {
    if (e.propertyName === 'max-height') {
      element.style.display = 'none';
      element.removeEventListener('transitionend', handler);
    }
  });
}

function renderFacilitiesV2() {
  const container = document.getElementById('facilities-accordion');
  container.className = 'w-[316px] max-lg:w-[90vw]';

  container.innerHTML = '';
  container.style.height = '415px';
  container.style.background = 'rgba(30,40,60,0.7)';
  container.style.borderRadius = '16px';
  container.style.boxShadow = '0 4px 24px 0 rgba(0,0,0,0.12)';
  container.style.padding = '0';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'stretch';
  container.style.position = 'relative';

  // Fixed header wrapper
  const headerWrap = document.createElement('div');
  headerWrap.className = 'max-lg:w-[90vw] text-center';
  headerWrap.style.position = 'fixed';
  headerWrap.style.top = '-70px';
  headerWrap.style.borderTopLeftRadius = '16px';
  headerWrap.style.borderTopRightRadius = '16px';
  headerWrap.style.zIndex = '10';
  headerWrap.style.display = 'flex';
  headerWrap.style.flexDirection = 'column';
  headerWrap.style.alignItems = 'stretch';
  headerWrap.style.padding = '20px 16px 12px 16px';
  headerWrap.style.textWrap = 'nowrap';

  // Dropdown select tầng + button
  const selectRow = document.createElement('div');
  selectRow.style.display = 'flex';
  selectRow.style.alignItems = 'center';
  selectRow.style.gap = '10px';
  selectRow.style.marginBottom = '10px';
  selectRow.style.width = '100px';
  selectRow.style.position = 'absolute';
  selectRow.style.bottom = '-70px';
  selectRow.style.left = '0';

  const select = document.createElement('select');
  select.style.flex = '1';
  select.style.padding = '8px 12px';
  select.style.borderRadius = '20px';
  select.style.fontSize = '16px';
  select.style.color = '#fff';
  select.style.background = '#19768a';
  window.facilitiesFloors.forEach((floor, idx) => {
    const option = document.createElement('option');
    option.value = idx;
    option.textContent = floor.floor;
    if (idx === currentFloorIndex) option.selected = true;
    select.appendChild(option);
  });
  select.addEventListener('change', (e) => {
    currentFloorIndex = +e.target.value;

    renderFacilitiesV2();
    // Chỉ render số sau khi ảnh load xong
    updateFacilitiesImage(currentFloorIndex, () => {
      renderFacilitiesNumbers(currentFloorIndex);
      if (window.setupFacilitiesHover) window.setupFacilitiesHover();
    });
  });
  selectRow.appendChild(select);

  container.appendChild(selectRow);

  // Tiêu đề
  const title = document.createElement('div');
  title.className = 'text-[3.33333rem] max-lg:text-[50px]';
  title.textContent = `Tiện ích ${window.facilitiesFloors[currentFloorIndex].floor}`;
  title.style.color = '#19768a';
  title.style.letterSpacing = '-1.28px';
  title.style.lineHeight = '1.17188';
  headerWrap.appendChild(title);
  container.appendChild(headerWrap);

  // List tiện ích (scrollable)
  const listWrap = document.createElement('div');
  listWrap.className = 'max-lg:w-[90vw]';
  listWrap.style.flex = '1';
  listWrap.style.overflowY = 'auto';
  listWrap.style.padding = '16px';
  listWrap.style.height = 'calc(560px - 110px)';

  const list = document.createElement('ul');
  list.style.listStyle = 'none';
  list.style.padding = '0';
  list.style.margin = '0';
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.gap = '8px';

  window.facilitiesFloors[currentFloorIndex].facilities.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'facilities-item';
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.gap = '16px';
    li.style.padding = '8px 16px';
    li.style.borderBottom = '1px dashed rgba(255,255,255,0.2)';
    li.style.cursor = 'pointer';

    li.addEventListener('mouseenter', () => {
      li.style.background = 'rgba(255,255,255,0.08)';
    });
    li.addEventListener('mouseleave', () => {
      li.style.background = 'transparent';
    });

    // Số thứ tự
    const num = document.createElement('span');
    num.textContent = item.label;
    num.className =
      'item_number flex w-6 h-6 justify-center items-center rounded-full text-[10px] font-semibold' +
      (isNaN(item.label) ? ' lowercase' : '');
    // XÓA border, ĐỔI background và color
    num.style.display = 'inline-flex';
    num.style.justifyContent = 'center';
    num.style.alignItems = 'center';
    num.style.width = '32px';
    num.style.height = '32px';
    num.style.borderRadius = '50%';
    num.style.background = 'linear-gradient(180deg,#fbda7d,#d09e6b)';
    num.style.color = '#006673'; // Đổi sang chữ trắng
    num.style.fontWeight = '700';
    num.style.fontSize = 'clamp(12px, .72917rem, .9375rem)';
    num.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.10)';
    // KHÔNG set border nữa
    li.appendChild(num);

    // Tên tiện ích
    const name = document.createElement('span');
    name.textContent = item.name;
    name.style.flex = '1';
    name.style.textAlign = 'right';
    name.style.fontWeight = '500';
    name.style.fontSize = '.83333rem';
    name.style.color = '#fff';
    li.appendChild(name);

    list.appendChild(li);
  });
  listWrap.appendChild(list);
  container.appendChild(listWrap);

  // Gọi lại logic hover cho list mới
  if (window.setupFacilitiesHover) window.setupFacilitiesHover();
}

function watchImageSize(imgElement, callback) {
  function reportSize() {
    const width = imgElement.offsetWidth;
    const height = imgElement.offsetHeight;
    callback({ width, height });
  }

  // Gọi lần đầu khi function được khởi tạo
  reportSize();

  // Lắng nghe sự kiện resize
  window.addEventListener('resize', reportSize);

  // Trả về function để hủy lắng nghe khi không cần nữa
  return () => window.removeEventListener('resize', reportSize);
}

function updateFacilitiesImage(currentFloorIndex, callback) {
  const img = document.querySelector('.bg_img');
  if (!img) return;
  const floorData = window.facilitiesFloors[currentFloorIndex || 0];
  img.onload = function () {
    if (callback) callback();
  };
  img.src = floorData.image;
}

const img = document.querySelector('.bg_img');
const container = document.getElementById('facilities-wrapper');

const stopWatching = watchImageSize(img, ({ width, height }) => {
  container.style.width = width + 'px';
  container.style.height = height + 'px';
});
container.addEventListener('click', (e) => {
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  watchImageSize(img, ({ width, height }) => {
    console.log('left:', x / width, ',top:', y / height);
  });
});

// Initial render
window.addEventListener('DOMContentLoaded', function () {
  renderFacilitiesV2();
  updateFacilitiesImage(currentFloorIndex, () => {
    renderFacilitiesNumbers(currentFloorIndex);
    if (window.setupFacilitiesHover) window.setupFacilitiesHover();
  });
});

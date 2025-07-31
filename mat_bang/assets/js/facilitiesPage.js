let currentFloorIndex = 0;

function setStyles(element, styles) {
  Object.assign(element.style, styles);
}

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
  const img = document.querySelector('.bg_img');
  if (!img) return;

  const numbers = window.facilitiesFloors[floorIndex].numbers;
  const facilities = window.facilitiesFloors[floorIndex].facilities;
  numbers.forEach((item, num_index) => {
    const div = document.createElement('div');
    let divClass = 'map_item absolute w-8 h-8 max-md:w-[11px] max-md:h-[11px] max-lg:w-4 max-lg:h-4 rounded-full text-[12px] max-lg:text-[8px] font-semibold flex items-center justify-center select-none text-[#006673]';
    if (isNaN(item.label)) {
      divClass += ' lowercase';
    } else {
      divClass += ' text-white';
    }
    if (facilities[num_index].previewImgUrl) {
      divClass += ' has-preview';
    }
    div.className = divClass;
    div.style.top =
      typeof item.top === 'string' && item.top.includes('%')
        ? item.top
        : item.top * 100 + '%';
    div.style.left =
      typeof item.left === 'string' && item.left.includes('%')
        ? item.left
        : item.left * 100 + '%';
    div.textContent = item.label;
    container.appendChild(div);
  });
}

function animateCollapseOpen(element) {
  setStyles(element, {
    display: 'block',
    overflow: 'hidden',
    maxHeight: '0px',
    opacity: '0',
    transition: '',
  });
  setTimeout(() => {
    setStyles(element, {
      transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s',
      maxHeight: '400px',
      opacity: '1',
    });
  }, 10);
  element.addEventListener('transitionend', function handler(e) {
    if (e.propertyName === 'max-height') {
      setStyles(element, { maxHeight: 'none', overflow: '' });
      element.removeEventListener('transitionend', handler);
    }
  });
}

function animateCollapseClose(element) {
  setStyles(element, {
    overflow: 'hidden',
    maxHeight: element.scrollHeight + 'px',
    opacity: '1',
    transition: '',
  });
  setTimeout(() => {
    setStyles(element, {
      transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s',
      maxHeight: '0px',
      opacity: '0',
    });
  }, 10);
  element.addEventListener('transitionend', function handler(e) {
    if (e.propertyName === 'max-height') {
      setStyles(element, { display: 'none' });
      element.removeEventListener('transitionend', handler);
    }
  });
}

function renderFloorSelection(currentFloorIndex, onChange) {
  const selectRow = document.createElement('div');
  selectRow.className = 'select-container';
  setStyles(selectRow, {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    position: 'absolute',
    top: '105%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '10',
    width: '100%',
  });

  const select = document.createElement('div');
  select.className = 'select-wrapper';
  setStyles(select, {
    padding: '0.625rem 1.66667rem',
    borderRadius: '50rem',
    borderBottom: '4px solid #9ed193',
    fontSize: '1.04167rem',
    color: '#fff',
    background: '#096773',
    height: '44px',
    fontFamily: 'sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.25rem',
    cursor: 'pointer',
  });

  window.facilitiesFloors.forEach((floor, idx) => {
    const optionContainer = document.createElement('div');
    optionContainer.className = 'option-container';
    const option = document.createElement('span');
    option.value = idx;
    option.textContent = floor.floor;
    if (idx === currentFloorIndex) optionContainer.classList.add('active');
    optionContainer.appendChild(option);
    select.appendChild(optionContainer);
  });

  select.addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN') {
      const idx = +e.target.value;
      onChange(idx);
      // Update active class
      const activeOption = select.querySelector('.option-container.active');
      if (activeOption) activeOption.classList.remove('active');
      e.target.parentElement.classList.add('active');
    }
  });

  selectRow.appendChild(select);
  return selectRow;
}

function renderFacilitiesV2() {
  const container = document.getElementById('facilities-accordion');
  if (!container) return;
  container.className = 'w-full';
  setStyles(container, {
    height: '415px',
    background: 'rgba(6,27,26,.5)',
    borderRadius: '.625rem',
    boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    position: 'relative',
    borderTop: '4px solid #9ed193',
    backdropFilter: 'blur(2.5px)',
    padding: '1.66667rem 1.04167rem',
  });
  container.innerHTML = '';

  // Header
  const headerWrap = document.createElement('div');
  headerWrap.className =
    'max-xl:w-[90vw] text-center top-[-120px] max-xl:top-[-80px]';
  setStyles(headerWrap, {
    position: 'fixed',
    left: '0px',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    zIndex: '10',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: '20px 0px 12px 0px',
    textWrap: 'nowrap',
  });

  // Title
  const title = document.createElement('div');
  title.className = 'max-md:text-[30px] max-lg:text-[50px] heading-wrapper';
  title.textContent = `Tiện ích ${window.facilitiesFloors[currentFloorIndex].floor}`;
  setStyles(title, {
    color: '#fff',
    textShadow: '0 0px 10px rgba(0,0,0,1)',
    letterSpacing: '-1.28px',
    lineHeight: '1.17188',
    fontSize: '3.33333rem',
  });
  headerWrap.appendChild(title);
  container.appendChild(headerWrap);

  // Floor Selection - now rendered inside facilities-accordion
  const floorSelection = renderFloorSelection(currentFloorIndex, (idx) => {
    currentFloorIndex = idx;
    renderFloor(currentFloorIndex + 1);
    renderFacilitiesV2();
    updateFacilitiesImage(currentFloorIndex, () => {
      renderFacilitiesNumbers(currentFloorIndex);
      if (window.setupFacilitiesHover) window.setupFacilitiesHover();
    });
  });
  container.appendChild(floorSelection);

  // List tiện ích
  const listWrap = document.createElement('div');
  listWrap.className = 'scroll_bar';
  setStyles(listWrap, {
    flex: '1',
    overflowY: 'auto',
    paddingRight: '.625rem',
    height: 'calc(560px - 110px)',
  });

  const list = document.createElement('ul');
  setStyles(list, {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  });

  const currentFloorFacilities = window.facilitiesFloors[currentFloorIndex].facilities;
  currentFloorFacilities.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'facilities-item';
    setStyles(li, {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '8px 16px 8px 0px',
      borderBottom: '1px dashed rgba(255,255,255,0.2)',
      cursor: 'pointer',
    });

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
      (isNaN(item.label) ? ' lowercase' : '') +
      (item.previewImgUrl ? ' has-preview' : '');
    setStyles(num, {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '50%',
      color: '#006673',
      fontWeight: '700',
      fontSize: 'clamp(12px, .72917rem, .9375rem)',
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
    });
    li.appendChild(num);

    // Tên tiện ích
    const name = document.createElement('span');
    name.textContent = item.name;
    setStyles(name, {
      flex: '1',
      textAlign: 'right',
      fontWeight: '500',
      fontSize: '.83333rem',
      color: '#fff',
    });
    li.appendChild(name);

    list.appendChild(li);
  });
  listWrap.appendChild(list);
  container.appendChild(listWrap);

  if (window.setupFacilitiesHover) window.setupFacilitiesHover();
}

function watchImageSize(imgElement, callback) {
  function reportSize() {
    callback({
      width: imgElement.offsetWidth,
      height: imgElement.offsetHeight,
    });
  }
  reportSize();
  window.addEventListener('resize', reportSize);
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
if (img && container) {
  watchImageSize(img, ({ width }) => {
    container.style.width = width + 'px';
  });
}

window.addEventListener('DOMContentLoaded', function () {
  renderFacilitiesV2();
  updateFacilitiesImage(currentFloorIndex, () => {
    renderFacilitiesNumbers(currentFloorIndex);
    if (window.setupFacilitiesHover) window.setupFacilitiesHover();
  });
});

function getFacilitiesFloorsDataForFloor(floorId) {
  return window.facilitiesFloors.find(
    (f) => f.id === floorId || f.floor === floorId,
  );
}

function renderFloor(floorId) {
  window.currentFloor = getFacilitiesFloorsDataForFloor(floorId);
}

setInterval(() => {
  document.querySelectorAll('.map_item.has-preview').forEach((item) => {
    if (item.classList.contains('anim-blink')) {
      item.classList.remove('anim-blink');
    } else {
      item.classList.add('anim-blink');
    }
  });
}, 1000);

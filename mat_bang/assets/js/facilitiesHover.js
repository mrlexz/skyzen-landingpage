// facilitiesHover.js

window.setupFacilitiesHover = function () {
  // DOM selectors
  const absoluteNumbers = document.querySelectorAll('.map_item');
  const facilityListItems = document.querySelectorAll('.facilities-item');

  // Check if device is mobile
  const isMobile = window.innerWidth < 1025;

  // --- Highlight logic ---
  function highlightElements(label) {
    absoluteNumbers.forEach((el) => {
      if (el.textContent.trim() === label) {
        el.classList.add('bg-white', 'text-[#19768a]', 'border-[#19768a]');
        el.classList.remove('text-white', 'border-white');
      }
    });
    facilityListItems.forEach((li) => {
      const span = li.querySelector('.item_number');
      if (span && span.textContent.trim() === label) {
        // span.classList.add('bg-white', 'text-[#19768a]');
        // span.classList.remove('text-white', 'border-white');
      }
    });
  }

  function clearHighlights() {
    facilityListItems.forEach((li) => {
      const span = li.querySelector('.item_number');
      if (span) {
        span.classList.remove('bg-[#d09e6b]', 'text-[#19768a]');
        // span.classList.add('border-white', 'text-white', 'bg-white');
      }
    });
    absoluteNumbers.forEach((absNum) => {
      absNum.classList.remove('bg-white', 'text-[#19768a]', 'border-[#19768a]');
      // absNum.classList.add('text-white', 'border-white', 'bg-gradient-to-b');
    });
  }

  // --- Facility info lookup ---
  function getFacilityInfoByLabel(label) {
    if (window.facilitiesFloors && Array.isArray(window.facilitiesFloors)) {
      const currentFloor = window.currentFloor;
      if (currentFloor) {
        const floor = window.facilitiesFloors.find(
          (f) => f.id === currentFloor.id,
        );
        if (floor) {
          const found = floor.facilities.find((f) => f.label === label);
          if (found)
            return { name: found.name, previewImgUrl: found.previewImgUrl };
        }
      }
      for (const floor of window.facilitiesFloors) {
        const found = floor.facilities.find((f) => f.label === label);
        if (found)
          return { name: found.name, previewImgUrl: found.previewImgUrl };
      }
    }
    if (window.facilitiesData && Array.isArray(window.facilitiesData)) {
      const found = window.facilitiesData.find((f) => f.label === label);
      if (found)
        return { name: found.name, previewImgUrl: found.previewImgUrl };
    }
    return { name: '', previewImgUrl: '' };
  }

  // --- Tooltip logic ---
  let tooltip = document.getElementById('facilities-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'flex flex-col items-center justify-center w-[200px]';
    tooltip.id = 'facilities-tooltip';
    Object.assign(tooltip.style, {
      position: 'absolute',
      zIndex: '9999',
      pointerEvents: 'none',
      background: '#19768a',
      color: 'white',
      padding: '10px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      display: 'none',
      textAlign: 'center',
    });
    document.body.appendChild(tooltip);
  }

  function showTooltip(target, text, imgUrl) {
    tooltip.innerHTML = '';
    const textElem = document.createElement('div');
    textElem.textContent = text;
    tooltip.appendChild(textElem);

    if (imgUrl) {
      const imgElem = document.createElement('img');
      imgElem.src = imgUrl;
      Object.assign(imgElem.style, {
        height: '80px',
        display: 'block',
        marginTop: '6px',
        objectFit: 'cover',
      });
      imgElem.onload = () => positionTooltip(target);
      tooltip.appendChild(imgElem);
    }
    positionTooltip(target);
  }

  function positionTooltip(target) {
    const rect = target.getBoundingClientRect();
    tooltip.style.display = 'block';
    tooltip.style.left =
      rect.left +
      window.scrollX +
      rect.width / 2 -
      tooltip.offsetWidth / 2 +
      'px';
    tooltip.style.top =
      rect.top + window.scrollY - tooltip.offsetHeight - 8 + 'px';

    // console.log(
    //   rect,
    //   'Tooltip position:',
    //   tooltip.style.left,
    //   tooltip.style.top,
    // );
  }

  function hideTooltip() {
    tooltip.style.display = 'none';
  }

  let modalIsShow = false;

  // --- Modal logic ---
  function showFacilityModal(name, imgUrl) {
    const modal = document.getElementById('facility-modal');
    const modalImg = document.getElementById('facility-modal-img');
    const modalTitle = document.getElementById('facility-modal-title');
    modalImg.src = imgUrl;
    modalTitle.textContent = name;
    modal.style.display = 'flex';
  }
  function hideFacilityModal() {
    document.getElementById('facility-modal').style.display = 'none';
    setTimeout(() => {
      modalIsShow = false;
    }, 100);
  }
  document.getElementById('facility-modal-close').onclick = hideFacilityModal;
  document.getElementById('facility-modal').onclick = function (e) {
    if (e.target === this) hideFacilityModal();
  };

  // --- Event binding ---
  function handleHover(label, anchorEl) {
    clearHighlights();
    highlightElements(label);
    const { name, previewImgUrl } = getFacilityInfoByLabel(label);
    if (name) showTooltip(anchorEl, name, previewImgUrl);
  }

  function handleClick(label) {
    const { name, previewImgUrl } = getFacilityInfoByLabel(label);
    if (name && previewImgUrl) showFacilityModal(name, previewImgUrl);
  }

  // Mobile click handler for tooltip toggle
  let activeLabel = null;
  function handleMobileClick(label, anchorEl) {
    const { name, previewImgUrl } = getFacilityInfoByLabel(label);

    // If item has image, show modal directly
    if (name && previewImgUrl) {
      showFacilityModal(name, previewImgUrl);
      modalIsShow = true;
    }

    // If item doesn't have image, toggle tooltip
    if (activeLabel === label) {
      // If clicking the same item, hide tooltip and clear highlights
      clearHighlights();
      hideTooltip();
      activeLabel = null;
    } else {
      // If clicking a different item, show tooltip and highlight
      clearHighlights();
      highlightElements(label);
      if (name) showTooltip(anchorEl, name, previewImgUrl);
      activeLabel = label;
    }
  }

  // Hover/click on map items
  absoluteNumbers.forEach((absNum) => {
    const label = absNum.textContent.trim();
    absNum.style.cursor = 'pointer';

    if (isMobile) {
      // Mobile: use click for tooltip toggle
      absNum.addEventListener('click', (e) => {
        e.preventDefault();
        handleMobileClick(label, absNum);
      });
    } else {
      // Desktop: use hover events
      absNum.addEventListener('mouseenter', () => handleHover(label, absNum));
      absNum.addEventListener('mouseleave', () => {
        clearHighlights();
        hideTooltip();
      });
      absNum.addEventListener('click', () => handleClick(label));
    }
  });

  // Hover/click on list items
  facilityListItems.forEach((li) => {
    const span = li.querySelector('.item_number');
    if (!span) return;
    const label = span.textContent.trim();

    if (isMobile) {
      // Mobile: use click for tooltip toggle
      li.addEventListener('click', (e) => {
        e.preventDefault();
        const anchor =
          Array.from(absoluteNumbers).find(
            (el) => el.textContent.trim() === label,
          ) || span;
        handleMobileClick(label, anchor);
      });
    } else {
      // Desktop: use hover events
      li.addEventListener('mouseenter', () => {
        // Find the first matching map item to anchor tooltip
        const anchor =
          Array.from(absoluteNumbers).find(
            (el) => el.textContent.trim() === label,
          ) || span;
        handleHover(label, anchor);
      });
      li.addEventListener('mouseleave', () => {
        clearHighlights();
        hideTooltip();
      });
      li.addEventListener('click', () => handleClick(label));
    }
  });

  // Add click outside to hide tooltip on mobile
  if (isMobile) {
    document.addEventListener('click', (e) => {
      console.log('🚀 ~ document.addEventListener ~ modalIsShow:', modalIsShow);
      if (modalIsShow) return;
      const isMapItem = e.target.closest('.map_item');
      const isFacilityItem = e.target.closest('.facilities-item');

      if (!isMapItem && !isFacilityItem) {
        clearHighlights();
        hideTooltip();
        activeLabel = null;
      }
    });
  }
};

const mainContainer = document.querySelector('.main_container');

if (mainContainer && window.innerWidth < 1025) {
  mainContainer.style.height = `calc(100dvh + ${
    ((415 + 67.5) / window.innerHeight) * 38
  }%)`;
}

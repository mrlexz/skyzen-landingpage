// facilitiesHover.js

window.setupFacilitiesHover = function () {
  // Select all absolute number/letter elements on the image
  const absoluteNumbers = document.querySelectorAll('.map_item');
  // Select all list items in the facilities list (ver2)
  const facilityListItems = document.querySelectorAll('.facilities-item');

  // Helper to remove highlight from all numbers/letters (both image and list)
  function clearHighlights() {
    facilityListItems.forEach((li) => {
      const span = li.querySelector('.item_number');
      if (span) {
        span.classList.remove('bg-[#d09e6b]', 'text-[#19768a]');
        span.classList.add('border-white', 'text-white', 'bg-white');
      }
    });
    absoluteNumbers.forEach((absNum) => {
      absNum.classList.remove('bg-white', 'text-[#19768a]', 'border-[#19768a]');
      absNum.classList.add('bg-[#d09e6b]', 'text-white', 'border-white');
    });
  }

  // Helper to get facility name by label
  function getFacilityNameByLabel(label) {
    if (window.facilitiesFloors && Array.isArray(window.facilitiesFloors)) {
      let found;
      for (const floor of window.facilitiesFloors) {
        found = floor.facilities.find((f) => f.label === label);
        if (found) break;
      }
      return found ? found.name : '';
    }
    if (window.facilitiesData && Array.isArray(window.facilitiesData)) {
      const found = window.facilitiesData.find((f) => f.label === label);
      return found ? found.name : '';
    }
    return '';
  }

  // Tooltip element
  let tooltip = document.getElementById('facilities-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'facilities-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = '9999';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.background = '#19768a';
    tooltip.style.color = 'white';
    tooltip.style.padding = '4px 10px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '12px';
    tooltip.style.fontWeight = '600';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
  }

  function showTooltip(target, text) {
    tooltip.textContent = text;
    // Position tooltip above the target
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
    setTimeout(() => {
      tooltip.style.left =
        rect.left +
        window.scrollX +
        rect.width / 2 -
        tooltip.offsetWidth / 2 +
        'px';
      tooltip.style.top =
        rect.top + window.scrollY - tooltip.offsetHeight - 8 + 'px';
    }, 0);
  }

  function hideTooltip() {
    tooltip.style.display = 'none';
  }

  // Hover on absoluteNumbers => highlight .facilities-item
  absoluteNumbers.forEach((absNum) => {
    const label = absNum.textContent.trim();
    absNum.style.cursor = 'pointer';
    absNum.addEventListener('mouseenter', () => {
      clearHighlights();
      // Highlight all matching numbers/letters on image
      absoluteNumbers.forEach((el) => {
        if (el.textContent.trim() === label) {
          el.classList.add('bg-white', 'text-[#19768a]', 'border-[#19768a]');
          el.classList.remove('text-white', 'border-white');
        }
      });
      // Highlight all matching list items
      facilityListItems.forEach((li) => {
        const span = li.querySelector('.item_number');
        if (span && span.textContent.trim() === label) {
          span.classList.add('bg-white', 'text-[#19768a]');
          span.classList.remove('text-white', 'border-white');
        }
      });
      // Show tooltip above hovered number/letter
      const facilityName = getFacilityNameByLabel(label);
      if (facilityName) {
        showTooltip(absNum, facilityName);
      }
    });
    absNum.addEventListener('mouseleave', () => {
      clearHighlights();
      hideTooltip();
    });
  });

  // Hover on .facilities-item => highlight absoluteNumbers
  facilityListItems.forEach((li) => {
    const span = li.querySelector('.item_number');
    if (!span) return;
    const label = span.textContent.trim();
    li.addEventListener('mouseenter', () => {
      clearHighlights();
      // Highlight all matching numbers/letters on image
      absoluteNumbers.forEach((el) => {
        if (el.textContent.trim() === label) {
          el.classList.add('bg-white', 'text-[#19768a]', 'border-[#19768a]');
          el.classList.remove('text-white', 'border-white');
          // Show tooltip above the number/letter on image (first match only)
          const facilityName = getFacilityNameByLabel(label);
          if (facilityName) {
            showTooltip(el, facilityName);
          }
        }
      });
      // Highlight all matching list items
      facilityListItems.forEach((li2) => {
        const span2 = li2.querySelector('.item_number');
        if (span2 && span2.textContent.trim() === label) {
          span2.classList.add('bg-white', 'text-[#19768a]');
          span2.classList.remove('text-white', 'border-white');
        }
      });
    });
    li.addEventListener('mouseleave', () => {
      clearHighlights();
      hideTooltip();
    });
  });
};

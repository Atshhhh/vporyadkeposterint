const firstScreenEl = document.querySelector('.first-screen');
const clockLevelEl = document.querySelector('.level_clock');
const spaceLevelEl = document.querySelector('.level_space');
const opinionEl = document.querySelector('.level_opinion');
const timeLevelValueEl = document.querySelector('.level__time-value');
const timeLevelClockEl = document.querySelector('.level__clock');
const opinionLevelMessageEl = document.querySelector('.level__message_opinion');
const timeLevelNextBtnEl = document.querySelector(
  '.level__next-level-btn_clock'
);

let currentHour = 1;
const firstGameAnswer = {
  '01': ['./assets/img/clocks/1.svg'],
  '02': ['./assets/img/clocks/2.svg'],
  '03': ['./assets/img/clocks/3.svg'],
  '04': ['./assets/img/clocks/4.svg'],
  '05': ['./assets/img/clocks/5.svg'],
  '06': ['./assets/img/clocks/6.svg'],
  '07': ['./assets/img/clocks/7.svg'],
  '08': ['./assets/img/clocks/8.svg'],
  '09': ['./assets/img/clocks/9.svg'],
  10: ['./assets/img/clocks/10.svg'],
  11: ['./assets/img/clocks/11.svg'],
  12: ['./assets/img/clocks/12.svg'],
  13: ['./assets/img/clocks/1.svg'],
  14: ['./assets/img/clocks/2.svg'],
  15: ['./assets/img/clocks/3.svg'],
  16: ['./assets/img/clocks/4.svg'],
  17: ['./assets/img/clocks/5.svg'],
  18: ['./assets/img/clocks/6.svg'],
  19: ['./assets/img/clocks/7.svg'],
  20: ['./assets/img/clocks/8.svg'],
  21: ['./assets/img/clocks/9.svg'],
  22: ['./assets/img/clocks/10.svg'],
  23: ['./assets/img/clocks/11.svg'],
  24: ['./assets/img/clocks/12.svg'],
};

const startGame = ({ firstScreenEl, hiddenClassname }) => {
  firstScreenEl.classList.add(hiddenClassname);
};

const init = () => {
  const randomTime = Math.floor(Math.random() * 24) + 1;
  let url = `url('./assets/img/clocks/${currentHour}.svg')`;
  let trueAnswer =
    firstGameAnswer[
      randomTime.toString().length === 1 ? `0${randomTime}` : randomTime
    ][0];

  firstScreenEl.addEventListener('click', () =>
    startGame({
      firstScreenEl,
      hiddenClassname: 'hidden',
    })
  );

  timeLevelValueEl.textContent =
    randomTime.toString().length === 1 ? `0${randomTime}` : randomTime;

  timeLevelClockEl.addEventListener('click', () => {
    if (currentHour === 12) {
      currentHour = 1;
    } else {
      currentHour++;
    }
    url = `url('./assets/img/clocks/${currentHour}.svg')`;
    trueAnswer =
      firstGameAnswer[
        randomTime.toString().length === 1 ? `0${randomTime}` : randomTime
      ][0];

    timeLevelClockEl.style.backgroundImage = url;
  });

  timeLevelNextBtnEl.addEventListener('click', () => {
    if (url.slice(5, -2) === trueAnswer) {
      clockLevelEl.classList.add('finish');
      spaceLevelEl.classList.remove('closed');
    } else {
      timeLevelNextBtnEl.classList.add('wrong');
      setTimeout(() => {
        timeLevelNextBtnEl.classList.remove('wrong');
      }, 500);
    }
  });

  const items = document.querySelectorAll('.level__item');
  const boxes = document.querySelectorAll('.level_box');
  let draggedItem = null;
  let offsetX = 0;
  let offsetY = 0;

  function isIntersecting(draggedItem, targetBox) {
    const draggedRect = draggedItem.getBoundingClientRect();
    const targetRect = targetBox.getBoundingClientRect();

    return !(
      draggedRect.right < targetRect.left ||
      draggedRect.left > targetRect.right ||
      draggedRect.bottom < targetRect.top ||
      draggedRect.top > targetRect.bottom
    );
  }

  items.forEach((item) => {
    item.addEventListener('mousedown', (e) => {
      draggedItem = e.target;

      const rect = draggedItem.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      draggedItem.style.zIndex = '1000';
    });

    document.addEventListener('mousemove', (e) => {
      if (draggedItem) {
        const parentRect = draggedItem.parentElement.getBoundingClientRect();
        let x = e.clientX - parentRect.left - offsetX;
        let y = e.clientY - parentRect.top - offsetY;

        const itemRect = draggedItem.getBoundingClientRect();
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x + itemRect.width > parentRect.width)
          x = parentRect.width - itemRect.width;
        if (y + itemRect.height > parentRect.height)
          y = parentRect.height - itemRect.height;

        draggedItem.style.left = `${x}px`;
        draggedItem.style.top = `${y}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (draggedItem) {
        let placed = false;

        boxes.forEach((box) => {
          const dataItem = box.getAttribute('data-item');
          const draggedItemData = draggedItem.getAttribute('data-img');

          if (
            isIntersecting(draggedItem, box) &&
            dataItem === draggedItemData
          ) {
            placed = true;

            box.classList.add('success');

            draggedItem.remove();
          }
        });

        if (!placed) {
          draggedItem.style.left = '';
          draggedItem.style.top = '';
        }

        draggedItem.style.zIndex = '1';
        draggedItem = null;
      }

      const lastImageEls = document
        .querySelector('.level__items')
        .querySelectorAll('img');

      if (!lastImageEls.length) {
        const btn = document.querySelector('.level__next-level-btn_space');
        btn.classList.remove('hidden');
        btn.addEventListener('click', () => {
          spaceLevelEl.classList.add('finish');
          opinionEl.classList.remove('closed');
        });
      }
    });
  });

  document.querySelectorAll('.level__row-item').forEach((item) => {
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    item.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      currentX = item.offsetLeft;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      let newX = currentX + deltaX;

      const rowWidth = item.parentElement.offsetWidth;
      const itemWidth = item.offsetWidth;

      newX = Math.max(0, Math.min(newX, rowWidth - itemWidth));

      item.style.left = `${newX}px`;

      if (newX >= rowWidth - itemWidth) {
        item.classList.add('success');
      } else {
        item.classList.remove('success');
      }

      checkIfAllElementsAreAtEnd();
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    function checkIfAllElementsAreAtEnd() {
      const allItems = document.querySelectorAll('.level__row-item');
      const allFinished = Array.from(allItems).every((item) =>
        item.classList.contains('success')
      );

      if (allFinished) {
        opinionEl.classList.add('goal');
        opinionLevelMessageEl.textContent = 'Спасибо!';
        opinionLevelMessageEl.classList.add('active');
      } else {
        opinionEl.classList.remove('goal');
      }
    }
  });
};

init();

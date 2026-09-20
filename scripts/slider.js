document.querySelectorAll('.slider').forEach(function(slider) {
    const track = slider.querySelector('.slider-list');
    const prev = slider.querySelector('.slider-prev');
    const next = slider.querySelector('.slider-next');

    let moving = false;

    function moveSlider(direction) {
        if (moving) return;
        moving = true;

        // если идём влево то переносим последнюю карточку в начало
        if (direction === -1) {
            track.prepend(track.lastElementChild);
        }

        // временная копия первой карточки
        const copy = track.firstElementChild.cloneNode(true);
        track.append(copy);

        // расстояние между карточками
        const firstCard = track.children[0];
        const secondCard = track.children[1];
        const distance = secondCard.offsetLeft - firstCard.offsetLeft;

        let start = 'translateX(0px)';
        let end = `translateX(-${distance}px)`;

        if (direction === -1) {
            start = `translateX(-${distance}px)`;
            end = 'translateX(0px)';
        }

        const animation = track.animate(
            [
                { transform: start },
                { transform: end }
            ],
            {
                duration: 550,
                easing: 'ease'
            }
        );

        animation.onfinish = function() {
            // вправо - переносим карточку в конец
            if (direction === 1) {
                track.append(track.firstElementChild);
            }

            // удаляем временную копию
            copy.remove();

            moving = false;
        };
    }

    next.addEventListener('click', function() {
        moveSlider(1);
    });

    prev.addEventListener('click', function() {
        moveSlider(-1);
    });
});